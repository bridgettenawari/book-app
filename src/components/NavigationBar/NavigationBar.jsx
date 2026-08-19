import './NavigationBar.css'
function NavigationBar({ onSearch }) {
  return (
    <div className='bar'>
    <h1 className='title'>Loco for Literature</h1>
    <div className='search'>
      <label className='label'>Search:</label>
      <input 
      className='input'
      type='text'
      placeholder='Search for books..'
      onChange={(e) => onSearch(e.target.value)}
      />
    </div>
    </div>
  );
}

export default NavigationBar;