import React, { useState, useEffect } from 'react';

function App() {
  const [partsAdded, setPartsAdded] = useState({
    seat: false,
    handlebars: false,
    pedals: false,
    chains: false,
    wheels: false,
  });

  const [bicycleRunnable, setBicycleRunnable] = useState(false);
  const [bicycleRunning, setBicycleRunning] = useState(false);
  const [serverResponse, setServerResponse] = useState('');
  const [bicycleRun, setBicycleRun] = useState(false);

  useEffect(() => {
    setBicycleRunnable(
      partsAdded.seat &&
      partsAdded.handlebars &&
      partsAdded.pedals &&
      partsAdded.chains &&
      partsAdded.wheels
    );
  }, [partsAdded]);

  const addPart = (partName) => {
    setPartsAdded((prevPartsAdded) => ({
      ...prevPartsAdded,
      [partName]: true,
    }));
  };

  const runBicycle = () => {
    if (bicycleRunnable && !bicycleRunning) {
      setBicycleRunning(true);
      fetch('http://127.0.0.1:8000/api/bicycle/run', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error('Failed to run the bicycle.');
          }
        })
        .then((data) => {
          setServerResponse(data.message);
          setBicycleRun(true);
        })
        .catch((error) => {
          console.error(error.message);
        })
        .finally(() => {
          setBicycleRunning(false);
        });
    }
  };

  const resetBicycle = () => {
    if (bicycleRun) {
      setPartsAdded({
        seat: false,
        handlebars: false,
        pedals: false,
        chains: false,
        wheels: false,
      });
      setBicycleRunnable(false);
      setServerResponse('');
      setBicycleRun(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className='text-4xl mb-4'>Run A Virtual Bicycle!</h1>
      <button
        onClick={() => addPart('seat')}
        className={`bg-blue-500 text-white px-4 py-2 rounded-md my-2 ${partsAdded.seat && 'bg-gray-400 cursor-not-allowed'
          }`}
        disabled={partsAdded.seat}
      >
        Add Seat
      </button>
      <button
        onClick={() => addPart('handlebars')}
        className={`bg-blue-500 text-white px-4 py-2 rounded-md my-2 ${partsAdded.handlebars && 'bg-gray-400 cursor-not-allowed'
          }`}
        disabled={partsAdded.handlebars}
      >
        Add Handlebars
      </button>
      <button
        onClick={() => addPart('chains')}
        className={`bg-blue-500 text-white px-4 py-2 rounded-md my-2 ${partsAdded.chains && 'bg-gray-400 cursor-not-allowed'
          }`}
        disabled={partsAdded.chains}
      >
        Add Chains
      </button>
      <button
        onClick={() => addPart('pedals')}
        className={`bg-blue-500 text-white px-4 py-2 rounded-md my-2 ${partsAdded.pedals && 'bg-gray-400 cursor-not-allowed'
          }`}
        disabled={partsAdded.pedals}
      >
        Add Pedals
      </button>
      <button
        onClick={() => addPart('wheels')}
        className={`bg-blue-500 text-white px-4 py-2 rounded-md my-2 ${partsAdded.wheels && 'bg-gray-400 cursor-not-allowed'
          }`}
        disabled={partsAdded.wheels}
      >
        Add Wheels
      </button>
      <button
        onClick={runBicycle}
        className={`bg-green-500 text-white px-4 py-2 rounded-md my-2`}
        disabled={!bicycleRunnable || bicycleRunning || bicycleRun}
      >
        Run Bicycle
      </button>
      <button
        onClick={resetBicycle}
        className={`bg-red-500 text-white px-4 py-2 rounded-md my-2`}
        disabled={bicycleRunning || !bicycleRun}
      >
        Reset Bicycle
      </button>
      {serverResponse &&
        <>
          <h1 className='text-3xl mt-4'>Server Responded With:</h1>
          <h2 className='text-2xl mt-2'>{serverResponse}!</h2>
        </>
      }
    </div>
  );
}

export default App;
