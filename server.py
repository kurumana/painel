from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os
import signal
import sys
from flask import Flask, request, jsonify

class FileHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Max-Age', '86400')

    def _safe_write(self, data):
        """Safely write data to the response with connection error handling."""
        try:
            self.wfile.write(data)
        except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError) as e:
            print(f'Connection error while writing response: {str(e)}')
            return False
        return True

    def do_GET(self):
        try:
            # Strip query parameters from path
            path_without_query = self.path.split('?')[0]
            
            if path_without_query == '/':
                # Serve index.html for root path
                index_path = os.path.join(os.path.dirname(__file__), 'index.html')
                if os.path.exists(index_path):
                    try:
                        self.send_response(200)
                        self.send_header('Content-type', 'text/html')
                        self._send_cors_headers()
                        self.end_headers()
                        with open(index_path, 'rb') as f:
                            if not self._safe_write(f.read()):
                                return
                    except ConnectionError as e:
                        print(f'Connection error while serving index.html: {str(e)}')
                        return
                else:
                    try:
                        self.send_response(404)
                        self.send_header('Content-type', 'text/plain')
                        self._send_cors_headers()
                        self.end_headers()
                        if not self._safe_write(b'Index file not found'):
                            return
                    except ConnectionError as e:
                        print(f'Connection error while sending 404 response: {str(e)}')
                        return
                return
            
            file_path = os.path.join(os.path.dirname(__file__), self.path.lstrip('/'))
            if os.path.exists(file_path) and os.path.isfile(file_path):
                try:
                    self.send_response(200)
                    if file_path.endswith('.html'):
                        self.send_header('Content-type', 'text/html')
                    elif file_path.endswith('.css'):
                        self.send_header('Content-type', 'text/css')
                    elif file_path.endswith('.js'):
                        self.send_header('Content-type', 'application/javascript')
                    else:
                        self.send_header('Content-type', 'application/octet-stream')
                    self._send_cors_headers()
                    self.end_headers()
                    with open(file_path, 'rb') as f:
                        if not self._safe_write(f.read()):
                            return
                except ConnectionError as e:
                    print(f'Connection error while serving file {file_path}: {str(e)}')
                    return
            else:
                self.send_response(404)
                self.send_header('Content-type', 'text/plain')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(b'File not found')
        except Exception as e:
            print(f'Error in GET request: {str(e)}')
            self.send_response(500)
            self.send_header('Content-type', 'text/plain')
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(str(e).encode())

    def do_POST(self):
        if self.path == '/create-file':
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                if content_length > 0:
                    post_data = self.rfile.read(content_length)
                    data = json.loads(post_data.decode('utf-8'))

                    # Ensure files are created in the 'files' directory
                    file_path = os.path.join(os.path.dirname(__file__), 'files', data['fileName'])
                    os.makedirs(os.path.dirname(file_path), exist_ok=True)
                    
                    # Write the new file
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(data['content'])

                    # Send response before updating search.html to prevent timeout
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self._send_cors_headers()
                    self.end_headers()
                    response = {'message': 'File created successfully', 'path': file_path}
                    if not self._safe_write(json.dumps(response).encode()):
                        return

                    # Update search.html with the new file after sending response
                    try:
                        search_file_path = os.path.join(os.path.dirname(__file__), 'search.html')
                        if os.path.exists(search_file_path):
                            with open(search_file_path, 'r', encoding='utf-8') as f:
                                content = f.read()
                            
                            # Find the files array
                            files_start = content.find('const files = [')
                            if files_start != -1:
                                # Find the end of the array
                                files_end = content.find('];', files_start)
                                if files_end != -1:
                                    # Get the current array content
                                    array_content = content[files_start:files_end + 2]
                                    # Create new array content with the new file
                                    new_file_path = f'"files/{data["fileName"]}"'
                                    new_array_content = array_content.replace('];', f',\n            {new_file_path}\n        ];')
                                    # Replace the old array with the new one
                                    content = content.replace(array_content, new_array_content)
                                    # Write the updated content back to search.html
                                    with open(search_file_path, 'w', encoding='utf-8') as f:
                                        f.write(content)
                    except Exception as e:
                        print(f'Error updating search.html: {str(e)}')
                        # Don't send error response here as we already sent success response
                else:
                    raise ValueError('No content received')
            except json.JSONDecodeError as e:
                print(f'Invalid JSON data: {str(e)}')
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self._safe_write(json.dumps({'error': 'Invalid JSON data'}).encode())
            except Exception as e:
                print(f'Error in POST request: {str(e)}')
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self._safe_write(json.dumps({'error': str(e)}).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

def run(server_class=HTTPServer, handler_class=FileHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting server on port {port}...')
    
    def signal_handler(signum, frame):
        print('\nShutting down the server...')
        httpd.server_close()
        sys.exit(0)
    
    # Set up signal handlers for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)  # Handle Ctrl+C
    signal.signal(signal.SIGTERM, signal_handler)  # Handle termination
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nShutting down the server...')
        httpd.server_close()
        sys.exit(0)

if __name__ == '__main__':
    run()

app = Flask(__name__)

@app.route('/create-file', methods=['POST'])
def criar_pagina():
    try:
        data = request.get_json()
        print("Dados recebidos:", data)  # Log para dados recebidos
        if not data or 'fileName' not in data or 'content' not in data:
            print("Dados inválidos recebidos:", data)  # Log para dados inválidos
            return jsonify({'error': 'Dados inválidos'}), 400

        # Certifique-se de que o diretório 'files' existe
        file_path = os.path.join(os.path.dirname(__file__), 'files', data['fileName'])
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        # Escreva o novo arquivo
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(data['content'])

        return jsonify({'message': 'Arquivo criado com sucesso!', 'path': file_path}), 201
    except OSError as e:
        print(f'Erro ao criar o arquivo: {str(e)}')  # Log do erro específico
        return jsonify({'error': 'Erro ao criar o arquivo: ' + str(e)}), 500
    except Exception as e:
        print(f'Erro ao criar a página: {str(e)}')  # Log do erro
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)