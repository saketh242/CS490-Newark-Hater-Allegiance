import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';


const CodeOutput = ({ code, language }) => {
    code = `# This is a Python script demonstrating a simple web server using Flask framework
    # It includes routes for handling basic CRUD operations on a hypothetical 'tasks' resource
    
    from flask import Flask, jsonify, request
    
    app = Flask(__name__)
    
    tasks = [
        {
            'id': 1,
            'title': 'Learn Python',
            'description': 'Complete tutorials and exercises to learn Python programming language',
            'done': False
        },
        {
            'id': 2,
            'title': 'Build a Web Application',
            'description': 'Use Flask framework to build a simple web application',
            'done': False
        },
        {
            'id': 3,
            'title': 'Deploy Application',
            'description': 'Deploy the web application to a hosting service',
            'done': False
        }
    ]
    
    @app.route('/tasks', methods=['GET'])
    def get_tasks():
        return jsonify({'tasks': tasks})
    
    @app.route('/tasks/<int:task_id>', methods=['GET'])
    def get_task(task_id):
        task = [task for task in tasks if task['id'] == task_id]
        if len(task) == 0:
            return jsonify({'error': 'Task not found'}), 404
        return jsonify({'task': task[0]})
    
    @app.route('/tasks', methods=['POST'])
    def create_task():
        if not request.json or 'title' not in request.json:
            return jsonify({'error': 'Title is required'}), 400
        task = {
            'id': tasks[-1]['id'] + 1,
            'title': request.json['title'],
            'description': request.json.get('description', ''),
            'done': False
        }
        tasks.append(task)
        return jsonify({'task': task}), 201
    
    @app.route('/tasks/<int:task_id>', methods=['PUT'])
    def update_task(task_id):
        task = [task for task in tasks if task['id'] == task_id]
        if len(task) == 0:
            return jsonify({'error': 'Task not found'}), 404
        if not request.json:
            return jsonify({'error': 'Request body is empty'}), 400
        task[0]['title'] = request.json.get('title', task[0]['title'])
        task[0]['description'] = request.json.get('description', task[0]['description'])
        task[0]['done'] = request.json.get('done', task[0]['done'])
        return jsonify({'task': task[0]})
    
    @app.route('/tasks/<int:task_id>', methods=['DELETE'])
    def delete_task(task_id):
        task = [task for task in tasks if task['id'] == task_id]
        if len(task) == 0:
            return jsonify({'error': 'Task not found'}), 404
        tasks.remove(task[0])
        return jsonify({'result': True})
    
    if __name__ == '__main__':
        app.run(debug=True)
    `;

        // Custom style object to change background color
        const customDracula = {
            ...dracula,
            'hljs': {
                ...dracula['hljs'],
                background: '#23262F', // Change background color to the desired color
            },
        };

    return (
        <div className="codeOutput">
            <SyntaxHighlighter language={language} style={customDracula}>
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeOutput;
