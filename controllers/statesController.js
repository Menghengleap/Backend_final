const data = {
    States: require('../data/statesData.json'),
    setStates: function (newData) { this.States = newData; }
}
const State = require('../models/state');

const getAllStates = async (req, res) => {
    let states = data.States;

    if (req.query.contig === 'true' || req.query.contig === 'false') {
        const isContig = req.query.contig === 'true';
        states = states.filter(state =>
            isContig ? !['AK', 'HI'].includes(state.code) : ['AK', 'HI'].includes(state.code)
        );
    }

    try {
        // Fetch all fun facts from MongoDB
        const allFunFacts = await State.find({});
        const funFactsMap = new Map(allFunFacts.map(state => [state.stateCode, state.funfacts]));

        // Merge fun facts with static state data
        const mergedStates = states.map(state => ({
            ...state,
            funfacts: funFactsMap.get(state.code.toUpperCase()) || []
        }));

        res.json(mergedStates);
    } catch (error) {
        res.status(500).json({ 'message': error.message });
    }
};

const getState = async (req, res) => {
    const stateCode = req.params.stateCode.toUpperCase();
    const state = data.States.find(st => st.code === stateCode);

    if (!state) {
        return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    }

    try {
        const dbState = await State.findOne({ stateCode: stateCode });

        if (dbState && dbState.funfacts && dbState.funfacts.length > 0) {
            state.funfacts = dbState.funfacts;
        }

        res.json(state);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 'message': 'Failed to retrieve state data from the database' });
    }
};


const getFunFact = async (req, res) => {
    const stateCode = req.params.stateCode.toUpperCase();
    const localState = data.States.find(s => s.code === req.params.stateCode.toUpperCase());
    if (!localState) {
        return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    }

    try {
        const state = await State.findOne({ stateCode: stateCode });
        if (!state || !state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ 'message': `No Fun Facts found for ${localState.state}` });
        }

        // Select a random fun fact from the array
        const randomIndex = Math.floor(Math.random() * state.funfacts.length);
        const funFact = state.funfacts[randomIndex];

        res.json({ 'funfact': funFact });
    } catch (error) {
        res.status(500).json({ 'message': error.message });
    }
};

const getDetail = (detail) => {
    return (req, res) => {
        const state = data.States.find(s => s.code === req.params.stateCode.toUpperCase());
        if (!state) {
            return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
        }
        if (!state[detail]) {
            return res.status(404).json({ 'message': `No ${detail} available for this state` });
        }
        var detail_value = state[detail];
        var detail_title = detail;
        
        if (detail_title === "capital_city") {
            detail_title = "capital";
        }else if(detail_title === "admission_date"){
            detail_title = "admitted";
        }

        if (detail_title === "population" && typeof detail_value === 'number') {
            // Format the number with commas as thousands separators
            detail_value = detail_value.toLocaleString('en-US');
        }

        res.json({ 'state': state.state, [detail_title]: detail_value });
    }
}
const addFunFact = async (req, res) => {
    const { stateCode } = req.params;
    const { funfacts } = req.body;

    if (!funfacts) {
        return res.status(400).json({ 'message': 'State fun facts value required' });
    }
    if(!Array.isArray(funfacts)){
        return res.status(400).json({ 'message': 'State fun facts value must be an array' });
    }

    const state = data.States.find(s => s.code === req.params.stateCode.toUpperCase());
    if (!state) {
        return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    }

    try {
        // Find the state or create it if it does not exist
        const updatedState = await State.findOneAndUpdate(
            { stateCode: stateCode.toUpperCase() },
            { $push: { funfacts: { $each: funfacts } } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        const responseObject = {
            _id: updatedState._id,
            stateCode: updatedState.stateCode,
            funfacts: updatedState.funfacts,
            __v: updatedState.__v
        };

        res.status(200).json(responseObject);
    } catch (error) {
        res.status(500).json({ 'message': error.message });
    }
};

const updateFunFact = async (req, res) => {
    const { stateCode } = req.params;
    const { index, funfact } = req.body;

    const localState = data.States.find(s => s.code === stateCode.toUpperCase());
    if (!localState) {
        return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    }

    if (!index || isNaN(parseInt(index))) {
        return res.status(400).json({ 'message': 'State fun fact index value required' });
    }

    if (!funfact) {
        return res.status(400).json({ 'message': 'State fun fact value required' });
    }

    try {
        const state = await State.findOne({ stateCode: stateCode.toUpperCase() });
        if (!state || !state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ 'message': `No Fun Facts found for ${localState.state}` });
        }
        
        const idx = parseInt(index) - 1; 
        if (idx < 0 || idx >= state.funfacts.length) {
            return res.status(404).json({ 'message': `No Fun Fact found at that index for ${localState.state}` });
        }

        state.funfacts[idx] = funfact;
        const updatedState = await state.save();

        const responseObject = {
            _id: updatedState._id,
            stateCode: updatedState.stateCode,
            funfacts: updatedState.funfacts,
            __v: updatedState.__v
        };

        res.json(responseObject);
    } catch (error) {
        res.status(500).json({ 'message': error.message });
    }
};


const deleteFunFact = async (req, res) => {
    const { stateCode } = req.params;
    const { index } = req.body;

    const localState = data.States.find(s => s.code === req.params.stateCode.toUpperCase());
    if (!localState) {
        return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    }

    if (!index || isNaN(parseInt(index))) {
        return res.status(400).json({ 'message': 'State fun fact index value required' });
    }

    try {
        const state = await State.findOne({ stateCode: stateCode.toUpperCase() });
        if (!state || !state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ 'message': `No Fun Facts found for ${localState.state}` });
        }
        
        const idx = parseInt(index) - 1;
        if (idx < 0 || idx >= state.funfacts.length) {
            return res.status(404).json({ 'message': `No Fun Fact found at that index for ${localState.state}` });
        }

        state.funfacts.splice(idx, 1);
        const updatedState = await state.save();

        const responseObject = {
            _id: updatedState._id,
            stateCode: updatedState.stateCode,
            funfacts: updatedState.funfacts,
            __v: updatedState.__v
        };

        res.json(responseObject);
    } catch (error) {
        res.status(500).json({ 'message': error.message });
    }
};

module.exports = {
    getAllStates,
    addFunFact,
    updateFunFact,
    deleteFunFact,
    getState,
    getFunFact,
    getCapital: getDetail('capital_city'),
    getNickname: getDetail('nickname'),
    getPopulation: getDetail('population'),
    getAdmission: getDetail('admission_date')
}
