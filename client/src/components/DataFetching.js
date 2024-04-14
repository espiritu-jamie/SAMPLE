import React, { useState, useEffect } from 'react';

function DataFetchingComponent() {
    const [data, setData] = useState(null);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        fetch(`${backendUrl}/api/data`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setData(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []); // The empty array ensures this effect runs only once after the initial render

    return (
        <div>
            {data ? <div>Loaded data: {JSON.stringify(data)}</div> : <div>Loading data...</div>}
        </div>
    );
}

export default DataFetchingComponent;
