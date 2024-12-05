const predictClassification = require('../services/inferenceService');
const getPredictionHistoryHandler = require('../services/getPredictionHistory');

const crypto = require('crypto');
const storeData = require('../services/storeData');

async function postPredictHandler(request, h) {
    const { image } = request.payload; 
    const { model } = request.server.app; 

    const { label, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        id,
        result: label,
        suggestion,
        createdAt
    };

    await storeData(id, data);
    
    const response = h.response({
        status: 'success',
        message: 'Model is predicted successfully',
        data
    });

    response.code(201);
    return response;
} 
async function getPredictionHistory(request, h) {
    try {
        const history = await getPredictionHistory(); // Panggil fungsi untuk mengambil riwayat dari firestore
        const response = h.response({
            status: 'success',
            data: history
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: error.message
        });
        response.code(500);
        return response;
    }
}

module.exports = { postPredictHandler, getPredictionHistory };

