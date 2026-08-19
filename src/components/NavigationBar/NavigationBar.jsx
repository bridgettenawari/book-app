import './NavigationBar.css'
function NavigationBar(onSearch) {
  return (
    <div className='bar'>
    <h1 className='title'>Loco for Literature</h1>
    <div className='search'>
      <label className='label'>Search:</label>
      <input className='input'/>
    </div>
    </div>
  );
}

export default NavigationBar;