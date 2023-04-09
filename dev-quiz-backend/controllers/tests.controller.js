const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

class TestsController {
    async getTests(req, res) {
        
    }

    async getTestById(req, res) {

    }

    async getUserTests(req, res) {

    }
}

module.exports = new TestsController();