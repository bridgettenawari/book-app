import './SideBar.css'
function SideBar() {
  return (
    <div className='bar'>
      <h3 className='filter'>Filter:</h3>
      <select>
        <option>Author</option>
        
      </select>
    </div>
  );
}

export default SideBar;