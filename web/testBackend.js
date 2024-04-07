const makeFetchCalls = async () => {
    const url = 'http://localhost:8000/test';
    
    for (let i = 0; i < 100; i++) {
      fetch(url)
        .then(response => response.text()) // Use .text() if the response is plain text
        .then(data => console.log(`Response from request ${i + 1}:`, data))
        .catch(error => console.error(`Error in request ${i + 1}:`, error));
    }
  };
  
  // Call the function to execute the fetch calls
  makeFetchCalls();
  