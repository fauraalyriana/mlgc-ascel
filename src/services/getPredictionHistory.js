const { Firestore } = require('@google-cloud/firestore');

async function getPredictionHistory() {
    const db = new Firestore();
    const predictionsRef = db.collection('predictions');
    const snapshot = await predictionsRef.get();

    if (snapshot.empty) {
        throw new Error('No predictions found');
    }

    const history = snapshot.docs.map(doc => ({
        id: doc.id,
        history: doc.data()
    }));

    return history;
}

module.exports = getPredictionHistory;
