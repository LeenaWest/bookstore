import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBook from './AddBook';
import './App.css';

ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
  const [books, setBooks] = useState([]);

  const [colDefs] = useState([
    { field: 'title', sortable: true, filter: true },
    { field: 'author', sortable: true, filter: true },
    { field: 'year', sortable: true, filter: true },
    { field: 'isbn', sortable: true, filter: true },
    { field: 'price', sortable: true, filter: true },
    {
      headerName: "",
      field: "delete",
      width: 90,
      cellRenderer: (params) => (
        <IconButton
          size="small"
          color="error"
          onClick={() => deleteBook(params.data.id)}
        >
          <DeleteIcon />
        </IconButton>
      )
    }
  ]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    fetch('https://bookstore-67f3a-default-rtdb.europe-west1.firebasedatabase.app/books.json')
      .then(response => response.json())
      .then(data => {
        if (!data) {
          setBooks([]);
          return;
        }

        const list = Object.entries(data).map(([id, item]) => ({
          id,
          ...item
        }));

        setBooks(list);
      })
      .catch(err => console.error(err));
  };

  const addBook = (book) => {
    fetch('https://bookstore-67f3a-default-rtdb.europe-west1.firebasedatabase.app/books.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book)
    })
      .then(() => fetchBooks())
      .catch(err => console.error(err));
  };

  const deleteBook = (id) => {
    fetch(`https://bookstore-67f3a-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`, {
      method: 'DELETE'
    })
      .then(() => fetchBooks())
      .catch(err => console.error(err));
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>

      <AddBook addBook={addBook} />

      <div style={{ height: 500, width: 1100, marginTop: 20 }}>
        <AgGridReact
          rowData={books}
          columnDefs={colDefs}
          getRowId={params => params.data.id}
        />
      </div>
    </>
  );
}

export default App;


