import React from 'react';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import AutoCompleteFilter from './autocomplete_filter.js';
import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { APP_URLS, get_url } from './url.js';

import {
    DataTypeProvider,
    FilteringState,
    IntegratedFiltering,
    IntegratedPaging,
    PagingState,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableFilterRow,
    TableColumnResizing,
    PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';

const styles = theme => ({
	title: {
		color: '#75B2dd',
		fontSize: '16px',	
	}
});

/* const HighlightedCell = (value) => (
  <Table.Cell>
    <span
      style={{
        color: '#3592BE',
      }}
    >
      {value}
    </span>
  </Table.Cell>
);

const Cell = (props) => {
	return <HighlightedCell {...props} />;
}; */

const styles2 = {
  customHeaderCell: {
    '& div': {
		color: '#3592BE',
		fontSize: '18px',
    }
    /*your styles here*/
  }
};


const CustomTableHeaderCellBase = ({ classes, ...restProps }) => {

  restProps.value = restProps.column.title || restProps.column.name;
  return <TableHeaderRow.Cell className={classes.customHeaderCell} {...restProps} />
}
export const CustomTableHeaderCell = withStyles(styles2)(CustomTableHeaderCellBase);


var __tagIdsTagsMap = {};

function ChippedTagsFormatter(input) {
    const {row, column, value} = input;
    if (!value){
        return "";
    }
    const allChips = [];
    if (typeof(value)=='number') {
        allChips.push(<Chip key={row.id + '_' + column['name'] + '_' + value} label={__tagIdsTagsMap[column['name']
        +'s'][value]['name']} />);
    }
    else {
        value.forEach(eachTagId => {
            allChips.push(<Chip key={row.id + '_' + column['name'] + '_' + eachTagId}
                                label={__tagIdsTagsMap[column['name']][eachTagId]['name']}/>);
        });
    }
    return allChips;
}

function ChippedTagsTypeProvider(props) {
    return (<DataTypeProvider formatterComponent={ChippedTagsFormatter} {...props} />);
}

function filterThroughArray(value, filter) {
    if ( value && filter && Array.isArray(filter.value)) {
        if(!Array.isArray(value)) {
            value = [value];
        }
        let allTagsPresent = true;
        filter.value.forEach(eachFilterTag => {
            allTagsPresent = allTagsPresent && (value.indexOf(eachFilterTag) != -1);
        });
        return allTagsPresent;
    }
}

class FileListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            allFilesMenu: {
                selectedFile: null,
                AnchorPos: null
            },
            allFiles: props.allFiles,
            confirmDelete: false,
            selectedFile: null
        };
        __tagIdsTagsMap = props.tagIdsTagsMap;
        this.columns = [
            {name: 'name', title: 'Name', filterType: 'textfield'},
            {name: 'description', title: 'Description', filterType: 'textfield'},
            {name: 'updated_time', title: 'Updated on', filterType: 'textfield'},
            {name: 'creators', title: 'Creators', filterType: 'autocomplete', tagKey: 'creators'},
            {name: 'coverage', title: 'Coverage', filterType: 'autocomplete', tagKey: 'coverages'},
            {name: 'subjects', title: 'Subjects', filterType: 'autocomplete', tagKey: 'subjects'},
            {name: 'keywords', title: 'Keywords', filterType: 'autocomplete', tagKey: 'keywords'},
            {name: 'workareas', title: 'Workareas', filterType: 'autocomplete', tagKey: 'workareas'},
            {name: 'language', title: 'Language', filterType: 'autocomplete', tagKey: 'languages'},
            {name: 'cataloger', title: 'Cataloger', filterType: 'autocomplete', tagKey: 'catalogers'},
        ];
        this.deleteCallback = props.onDelete;
        this.editCallback = props.onEdit;
        this.closeConfirmDialog = this.closeConfirmDialog.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.handleFilesRightClick = this.handleFilesRightClick.bind(this);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
        this.getFilterCellComponent = this.getFilterCellComponent.bind(this);
        this.filterExtensions = [
            {columnName: 'creators', predicate: filterThroughArray},
            {columnName: 'coverage', predicate: filterThroughArray},
            {columnName: 'subjects', predicate: filterThroughArray},
            {columnName: 'keywords', predicate: filterThroughArray},
            {columnName: 'workareas', predicate: filterThroughArray},
            {columnName: 'language', predicate: filterThroughArray},
            {columnName: 'cataloger', predicate: filterThroughArray},
        ];
    }

    componentWillReceiveProps(props) {
        __tagIdsTagsMap = props.tagIdsTagsMap;
        this.setState({allFiles: props.allFiles})
    }

    handleFilesRightClick(evt, row, menuName) {
        this.setState({
            [menuName]: {
                selectedFile: row,
                AnchorPos: {top:evt.clientY, left:evt.clientX}
            },
            selectedFile: row
        });
        evt.preventDefault();
    }

    handleMenuClose(evt, menuName) {
        this.setState({
            [menuName]: {
                selectedFile: null,
                AnchorPos: null
            }
        });
    }

    tableRowComponent(obj, menuName)  {
        const {row, children} = obj;
        return(<tr onContextMenu={evt => this.handleFilesRightClick(evt, row, menuName)}>{children}</tr>);
    }

    deleteFile(file) {
        const targetUrl = get_url(APP_URLS.CONTENT_DETAIL, {id: file.id});
        const currentInstance = this;
        axios.delete(targetUrl).then(function (response) {
            if (currentInstance.deleteCallback){
                currentInstance.deleteCallback(file);
            }
        }).catch(function (error) {
            console.error("Error in deleting the file ", error);
        });
    }

    confirmDeleteContent() {
        this.setState({
            confirmDelete: true
        })
    }

    closeConfirmDialog() {
        this.setState({confirmDelete: false})
    }

    getFilterCellComponent(props) {
        const {filter, onFilter, column, filteringEnabled} = props;
        if (column.filterType === "autocomplete") {
            const { tagKey } = column;
            return (
                <TableCell style={{paddingLeft: '10px', paddingRight: '5px'}}>
                    <AutoCompleteFilter filter={filter} suggestions={this.props.tags[tagKey]} onFilter={onFilter} />
                </TableCell>
            );
        }
        return (
            <TableCell style={{paddingLeft: '10px', paddingRight: '5px'}}>
                <Input
                    fullWidth
                    value={filter ? filter.value : ''}
                    placeholder='Filter...'
                    onChange={evt => onFilter(evt.target.value ? { value: evt.target.value } : null)}
                />
            </TableCell>
        );
    }
	



    render() {
        return (
            <React.Fragment>
                
                <Grid
                    rows={this.props.allFiles}
                    columns={this.columns}
					style={{color: '#3592BE'}}
                >
                    <ChippedTagsTypeProvider for={['creators', 'coverage', 'subjects', 'keywords', 'workareas', 'language', 'cataloger']} />
                    <FilteringState defaultFilters={[]} columnExtensions={[{columnName: 'content_file', filteringEnabled: false}]} />
                    <IntegratedFiltering columnExtensions={this.filterExtensions} />
                    <PagingState defaultCurrentPage={0} defaultPageSize={10} />
                    <IntegratedPaging />
                    <Table style={{width: '100%', color: '#3592BE', fontFamily: 'Asap', fontWeight: 'bold'}} rowComponent={obj => {return this.tableRowComponent(obj, 'allFilesMenu')}} />
                    <TableColumnResizing
                        defaultColumnWidths={[
                            { columnName: 'name', width: 230 },
                            { columnName: 'description', width: 400 },
                            { columnName: 'creators', width: 140 },
                            { columnName: 'coverage', width: 140 },
                            { columnName: 'subjects', width: 140 },
                            { columnName: 'keywords', width: 140 },
                            { columnName: 'workareas', width: 140 },
                            { columnName: 'language', width: 140 },
                            { columnName: 'cataloger', width: 140 },
                            { columnName: 'updated_time', width: 140 },
                        ]} />
                    <TableHeaderRow cellComponent={CustomTableHeaderCell} />
                    <TableFilterRow cellComponent={this.getFilterCellComponent}/>
                    <PagingPanel pageSizes={[5, 10, 20]} />
                </Grid>
                <Menu
                    id="all-files-menu"
                    anchorPosition={this.state.allFilesMenu.AnchorPos}
                    anchorReference={'anchorPosition'}
                    open={Boolean(this.state.allFilesMenu.AnchorPos)}
                    onClose={evt => { this.handleMenuClose(evt, 'allFilesMenu');}}
                >
                    <MenuItem
                        onClick={evt => {
                            this.editCallback(this.state.selectedFile);
                        }}
                    >
                        Edit this file
                    </MenuItem>
                    <MenuItem
                        onClick={evt => {
                            this.handleMenuClose(evt, 'allFilesMenu');
                            window.open(this.state.allFilesMenu.selectedFile.content_file, '_blank');
                        }}
                    >
                        View this file
                    </MenuItem>
                    <MenuItem
                        onClick={evt => {
                            this.handleMenuClose(evt, 'allFilesMenu');
                            this.confirmDeleteContent();
                        }}
                    >
                        Delete this file
                    </MenuItem>
                </Menu>
                <Dialog
                    open={this.state.confirmDelete}
                    onClose={this.closeConfirmDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Confirm Delete?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this file {this.state.name}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeConfirmDialog} color="primary">
                            No
                        </Button>
                        <Button onClick={evt => {this.closeConfirmDialog(); this.deleteFile(this.state.selectedFile);}} color="primary" autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={Boolean(this.state.message)}
                    onClose={this.handleCloseSnackbar}
                    message={<span>{this.state.message}</span>}
                    ContentProps={{
                        "style": this.getErrorClass()
                    }}
                />
            </React.Fragment>
        );
    }
    getErrorClass() {
        return this.state.messageType === "error" ? {backgroundColor: '#B71C1C', fontWeight: 'normal'} : {};
    }

    handleCloseSnackbar() {
        this.setState({
            message: null,
            messageType: 'info'
        })
    }
}
export default withStyles(styles)(FileListComponent);
