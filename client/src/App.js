import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';
import './index.css'

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/customers?page=${currentPage}&search=${searchQuery}`);
        setCustomers(response.data);
      } catch (error) {
        setError('Error fetching data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchQuery]);

  const handlePaginationClick = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className='maindiv'>
      <h2><u>CUSTOMER LIST</u></h2>
      <div>
        <input
          type="text"
          placeholder="Search by Name or Location"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button onClick={() => setCurrentPage(1)}>Search</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className='table'>
          <table className='table-data' striped bordered hover>
            <thead className='heading'>
              <tr>
                <th>S.No</th>
                <th>Customer Name</th>
                <th>Age</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.sno}</td>
                  <td>{customer.customer_name}</td>
                  <td>{customer.age}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.location}</td>
                  <td>{new Date(customer.created_at).toLocaleDateString()}</td>
                  <td>{new Date(customer.created_at).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination>
            <button>
              <Pagination.Prev
                onClick={() => handlePaginationClick(currentPage - 1)}
                disabled={currentPage === 1}
              />
            </button>
            <button>
              <Pagination.Item active>{currentPage}</Pagination.Item>
            </button>
            <button>
              <Pagination.Next onClick={() => handlePaginationClick(currentPage + 1)} />
            </button>
            {/* Calculate the total number of pages on the server side */}
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default App;