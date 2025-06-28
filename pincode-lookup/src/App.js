import React, { useState } from 'react';
import './App.css';

function App() {
  const [pincode, setPincode] = useState('');
  const [postOffices, setPostOffices] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchedPincode, setFetchedPincode] = useState('');

  const handleLookup = async () => {
    if (pincode.length !== 6 || isNaN(pincode)) {
      setError('Please enter a valid 6-digit pincode.');
      setPostOffices([]);
      return;
    }

    setLoading(true);
    setError('');
    setPostOffices([]);

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0].Status === 'Error' || !data[0].PostOffice) {
        setError('No data found for this pincode.');
      } else {
        setPostOffices(data[0].PostOffice);
        setFetchedPincode(pincode);
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    }

    setLoading(false);
  };

  const filteredPostOffices = postOffices.filter((office) =>
    office.Name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container">
      <div className="left">
        <h3>Enter Pincode</h3>
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Pincode"
        />
        <button onClick={handleLookup}>Lookup</button>
      </div>

      <div className="right">
        {loading && <div className="loader"></div>}

        {!loading && error && <p className="error">{error}</p>}

        {!loading && !error && postOffices.length > 0 && (
          <>
            <p><strong>Pincode:</strong> {fetchedPincode}</p>
            <p><strong>Message:</strong> Number of pincode(s) found: {postOffices.length}</p>

            <input
              type="text"
              placeholder="🔍 Filter"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />

            <div className="cards">
              {filteredPostOffices.length > 0 ? (
                filteredPostOffices.map((office, index) => (
                  <div key={index} className="card">
                    <p><strong>Name:</strong> {office.Name}</p>
                    <p><strong>Branch Type:</strong> {office.BranchType}</p>
                    <p><strong>Delivery Status:</strong> {office.DeliveryStatus}</p>
                    <p><strong>District:</strong> {office.District}</p>
                    <p><strong>Division:</strong> {office.Division}</p>
                  </div>
                ))
              ) : (
                <p className="error">Couldn’t find the postal data you’re looking for…</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
