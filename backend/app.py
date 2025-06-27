from flask import Flask, request, jsonify
from flask_cors import CORS 
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # Explicit CORS origin

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tickets.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Ticket model
class Ticket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(200))
    description = db.Column(db.Text)
    issue_type = db.Column(db.String(100))
    subcategory = db.Column(db.String(100))
    priority = db.Column(db.Integer)
    status = db.Column(db.String(50), default='open')
    owner = db.Column(db.String(100), default='')
    is_incident = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Create tables if they don't exist
with app.app_context():
    db.create_all()

# Get all tickets
@app.route('/tickets', methods=['GET'])
def get_tickets():
    tickets = Ticket.query.all()
    return jsonify([
        {
            "id": t.id,
            "subject": t.subject,
            "description": t.description,
            "issue_type": t.issue_type,
            "subcategory": t.subcategory,
            "priority": t.priority,
            "status": t.status,
            "owner": t.owner,
            "created_at": t.created_at.isoformat(),
            "updated_at": t.updated_at.isoformat()
        }
        for t in tickets
    ])

# Create new ticket
@app.route('/tickets', methods=['POST'])
def create_ticket():
    data = request.get_json()
    ticket = Ticket(
        subject=data.get('subject', ''),
        description=data.get('description', ''),
        issue_type=data.get('issue_type', ''),
        subcategory=data.get('subcategory', ''),
        priority=int(data.get('priority', 0)),
        status='open',
        owner=''
    )
    db.session.add(ticket)
    db.session.commit()
    return jsonify({
        "id": ticket.id,
        "subject": ticket.subject,
        "description": ticket.description,
        "issue_type": ticket.issue_type,
        "subcategory": ticket.subcategory,
        "priority": ticket.priority,
        "status": ticket.status,
        "owner": ticket.owner,
        "created_at": ticket.created_at.isoformat(),
        "updated_at": ticket.updated_at.isoformat()
    }), 201

# Claim ticket endpoint
@app.route('/tickets/<int:ticket_id>/claim', methods=['PUT'])
def claim_ticket(ticket_id):
    data = request.get_json()
    ticket = Ticket.query.get_or_404(ticket_id)
    ticket.owner = data.get('owner', 'Unassigned')
    ticket.status = 'acknowledged'
    db.session.commit()
    return jsonify({"message": f"Ticket {ticket_id} claimed."})

@app.route('/tickets/<int:ticket_id>', methods=['PUT'])
def update_ticket(ticket_id):
    ticket = Ticket.query.get_or_404(ticket_id)
    data = request.get_json()

    # Update fields safely
    if 'priority' in data:
        ticket.priority = data['priority']
    if 'status' in data:
        ticket.status = data['status']
    if 'owner' in data:
        ticket.owner = data['owner']
    if 'description' in data:
        ticket.description = data['description']

    db.session.commit()
    return jsonify({"message": f"Ticket {ticket_id} updated."}), 200

# Get ticket by owner
@app.route('/tickets/owner/<string:owner>', methods=['GET'])
def get_tickets_by_owner(owner):
    tickets = Ticket.query.filter_by(owner=owner).all()
    return jsonify([
        {
            "id": t.id,
            "subject": t.subject,
            "description": t.description,
            "issue_type": t.issue_type,
            "subcategory": t.subcategory,
            "priority": t.priority,
            "status": t.status,
            "owner": t.owner,
            "created_at": t.created_at.isoformat(),
            "updated_at": t.updated_at.isoformat()
        }
        for t in tickets
    ])

# Start the app on port 5050
if __name__ == '__main__':
    app.run(debug=True, port=5050)
