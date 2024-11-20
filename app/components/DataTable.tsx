import headers from '../../app/json/user.json'
import {UserConfigBtn} from '../components/Modal';

const DataTable = () => (

    <table style={{border: '2px solid #000000', width: '100%', fontSize: '18px'}}>
        <thead>
            <tr style={{height: '80px'}}>
                {headers.Header.map((Item) => 
                <th key={Item.text} style={{width: '14%'}}>
                    {Item.text}
                </th>)}
            </tr>
        </thead>
        <tbody>
        {headers.user.map((Item) =>
            <tr key={Item.hak} style={{textAlign: 'center', height: '80px'}}>
                <td>{Item.ID}</td>
                <td>{Item.name}</td>
                <td>{Item.permision}</td>
                <td>{Item.email}</td>
                <td>{Item.role}</td>
                <td>{Item.hak}</td>
                <td><UserConfigBtn input = {Item}/></td>
            </tr>)}
        </tbody>
    </table>
);

export default DataTable;