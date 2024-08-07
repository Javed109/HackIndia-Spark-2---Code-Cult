document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const owner = document.getElementById('owner').value;
    const data = document.getElementById('data').value;
  
    try {
      const response = await axios.post('http://localhost:3000/upload', { owner, data });
      alert(response.data);
    } catch (error) {
      alert('Error uploading data');
    }
  });
  