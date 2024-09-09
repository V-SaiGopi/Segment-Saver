import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableSchemas, setAvailableSchemas] = useState([
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' }
  ]);

  const handleSchemaChange = (index, value) => {
    const newSchemas = [...selectedSchemas];
    newSchemas[index] = value;
    setSelectedSchemas(newSchemas);
  };

  const addNewSchema = () => {
    setSelectedSchemas([...selectedSchemas, '']);
  };

  const handleSaveSegment = () => {
    if (!segmentName.trim()) {
      alert('Please provide a segment name.');
      return;
    }

    if (selectedSchemas.every(schema => !schema)) {
      alert('Please select at least one schema.');
      return;
    }

    const schemaData = selectedSchemas.map(schema => {
      const selectedOption = availableSchemas.find(option => option.value === schema);
      return selectedOption ? { [schema]: selectedOption.label } : null;
    }).filter(item => item !== null);

    const dataToSend = {
      segment_name: segmentName,
      schema: schemaData,
    };

    axios
      .post('http://localhost:3001/proxy', dataToSend)
      .then(response => {
        alert('Segment saved successfully!');
        console.log('Response:', response.data);
        setShowModal(false);
        setSegmentName('');
        setSelectedSchemas([]);
      })
      .catch(error => {
        console.error('Error saving segment:', error);
        alert('An error occurred while saving the segment.');
      });
  };

  return (
    <div className="App">
      <button className="save-segment-btn" onClick={() => setShowModal(true)}>Save segment</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="back-btn" onClick={() => setShowModal(false)}>&lt; Back</button>
            <h2>Saving Segment</h2>
            <input
              type="text"
              className="segment-input"
              placeholder="Name of the segment"
              value={segmentName}
              onChange={e => setSegmentName(e.target.value)}
            />

            {selectedSchemas.map((schema, index) => (
              <div key={index} className="dropdown-wrapper">
                <select
                  value={schema}
                  onChange={e => handleSchemaChange(index, e.target.value)}
                >
                  <option value="">Add schema to segment</option>
                  {availableSchemas
                    .filter(option => !selectedSchemas.includes(option.value) || option.value === schema)
                    .map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
                {selectedSchemas.length > 1 && (
                  <button
                    className="remove-schema-btn"
                    onClick={() => {
                      const newSchemas = selectedSchemas.filter((_, i) => i !== index);
                      setSelectedSchemas(newSchemas);
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <div className="add-schema">
              <button className="add-schema-btn" onClick={addNewSchema}>+ Add new schema</button>
            </div>

            <div className="modal-footer">
              <button className="save-btn" onClick={handleSaveSegment}>Save the Segment</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
