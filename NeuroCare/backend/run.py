import os
from app import create_app

# Create the Flask application
app = create_app()

# Run the application
if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )
