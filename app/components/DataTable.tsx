import headers from '../../app/json/user.json'

const DataTable = () => (

    <table style={{border: '2px solid #000000', width: '100%'}}>
        <thead>
            <tr>
                {headers.Header.map((Item) => 
                <th key={Item.text} style={{width: '14%'}}>
                    {Item.text}
                </th>)}
            </tr>
        </thead>
        <tbody>
            <tr>
                {headers.user.map((Item) =>
                <td key={Item.hak}>

                </td>)}
            </tr>
        </tbody>
    </table>
);

export default DataTable;