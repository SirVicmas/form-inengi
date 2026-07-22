// Generates a short, readable ticket code like "FI-7K2P9X"
// Avoids ambiguous characters (0/O, 1/I) to reduce misreads at the door.
function generateTicketCode() {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return `FI-${code}`;
}

module.exports = generateTicketCode;