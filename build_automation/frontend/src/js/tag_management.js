import axios from 'axios';
import React from 'react';
import TagCreation from './addTag'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import OpenInNew from '@material-ui/icons/OpenInNew';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'; 
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';

import {
    DataTypeProvider,
    FilteringState,
    IntegratedFiltering,
    IntegratedPaging,
    PagingState,
} from '@devexpress/dx-react-grid';
import {
    Grid as DataGrid,
    Table,
    TableHeaderRow,
    TableFilterRow,
    TableColumnResizing,
    PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';

import TableRow from '@material-ui/core/TableRow';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { APP_URLS } from "./url";
import cloneDeep from 'lodash/fp/cloneDeep';
import { TAG_SAVE_TYPE } from './constants.js';
import { ActionPanel } from './action_panel';

const ExpansionPanel = withStyles({
  root: {
	boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    border: '1.2px solid rgba(0,0,0,1)',
    borderRadius: '15px !important',
    margin: '20px',
    marginLeft: '15%',
    marginRight: '15%',
    '&:before': {
      display: 'none',
    },
  },
})(MuiExpansionPanel);

const theme = createMuiTheme({
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: "Asap",
	fontSize: 20,
	h6: {
		fontWeight: "600",
	},
  },
  palette: {
		primary: {
		  main: '#3592BE',
		  dark: '#75B2DD',
		  contrastText: '#FFFFFF'
		},
		secondary: {
		  main: '#FFFFFF'
		}
  },
});

const styles = theme => ({
  paragraph: {
    color: '#75B2dd',
    fontSize: '25px',
	fontWeight: '800',
  },
});

/*
* Tag management constructor
*/

class TagManagementComponent extends React.Component {
    constructor(props) {
        super(props);

        this.getActionPanel = this.getActionPanel.bind(this)
        this.handleTagEdit = this.handleTagEdit.bind(this);

        this.state = {
            selectedTag: null,
            currentPanel: null,
            selectedTagsMenu: {
                selectedTag: null,
                AnchorPos: null
            },
            confirmDelete: false,
            message: null,
            messageType: 'info',
            currentView: 'manage',
            currentTitle: 'Coverages',
            expanded: null,
            listUrl: null,
            detailUrl: null,
            creatorColumns: [
                { name: 'actions', title: 'Actions', getCellValue: this.getActionPanel},
                { name: 'name', title: 'Name' },
                { name: 'description', title: 'Description' },
            ],
            creatorRows: [],
            keywordColumns: [
                { name: 'actions', title: 'Actions', getCellValue: this.getActionPanel},
                { name: 'name', title: 'Name' },
                { name: 'description', title: 'Description' }
            ],
            keywordRows: [],
            coverageColumns: [
                { name: 'actions', title: 'Actions', getCellValue: this.getActionPanel},
                { name: 'name', title: 'Name' },
                { name: 'description', title: 'Description' }
            ],
            coverageRows: [],
            subjectColumns: [
                { name: 'actions', title: 'Actions', getCellValue: this.getActionPanel},
                { name: 'name', title: 'Name' },
                { name: 'description', title: 'Description' },
            ],
            subjectRows: [],
            workareaColumns: [
                { name: 'actions', title: 'Actions', getCellValue: this.getActionPanel},
                { name: 'name', title: 'Name' },
                { name: 'description', title: 'Description' },
            ],
            workareaRows: [],
            languageColumns: [
                { name: 'actions', title: 'Actions', getCellValue: this.getActionPanel},
                { name: 'name', title: 'Name' },
                { name: 'description', title: 'Description' },
            ],
            languageRows: [],
            catalogerColumns: [
                { name: 'actions', title: 'Actions', getCellValue: this.getActionPanel},
                { name: 'name', title: 'Name' },
                { name: 'description', title: 'Description' },
            ],
            catalogerRows: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.setCurrentView = this.setCurrentView.bind(this);
        this.setUrls = this.setUrls.bind(this);
        this.handleFilesRightClick = this.handleTagsRightClick.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
        this.deleteTag = this.deleteTag.bind(this);
        this.handleAccordionClick = this.handleAccordionClick.bind(this);
        this.saveTagCallback = this.saveTagCallback.bind(this);
        
        this.addNewTag = this.addNewTag.bind(this);
        this.confirmDeleteTag = this.confirmDeleteTag.bind(this);
        this.closeConfirmDialog = this.closeConfirmDialog.bind(this);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
    }
    
    //Returns an action panel for a metadata table given the row data for that table
    getActionPanel(row) {
        return (
            <ActionPanel
                editFn={evt => {
                    this.setState({selectedTag: row}, this.handleTagEdit)
                }}
                deleteFn={evt => {
                    this.setState({
                        selectedTag: row,
                        confirmDelete: true
                    })
                }}
            />
        )
    }
    /*
    * Error method
    */
    getErrorClass() {
        return this.state.messageType === "error" ? { backgroundColor: '#B71C1C', fontWeight: 'normal' } : {};
    }
    /*
    * File deleted
    */
    confirmDeleteTag() {
        this.setState({
            confirmDelete: true
        })
    }
    /*
    * Close delete window(file won't be deleted)
    */
    closeConfirmDialog() {
        this.setState({ confirmDelete: false })
    }
    /*
    * Handle an edit
    */
    handleChange(panel) {
        const thisInstance = this
        return function (event, expanded) {
            thisInstance.setState({
                expanded: expanded ? panel : false,

            });
        }
    }
    /*
    * Handle drop downs
    */
    handleAccordionClick(panel) {
        this.setState({
            currentPanel: panel
        });
    }
    /*
    * Designate url to file
    */
    setUrls(listUrl, detailUrl) {
        this.setState({
            listUrl: listUrl,
            detailUrl: detailUrl
        })
    }
    /*
    * Change the view(window)
    */
    setCurrentView(viewName, selectedPanel) {
        this.setState({
            currentView: viewName,
            currentTitle: selectedPanel
        })
    }
    /*
    * Handle the addition of new metadata
    */
    addNewTag(selectedPanel) {
        this.setState({
            currentView: 'addTag',
            currentTitle: selectedPanel,
            selectedTag: {
                id: -1,
                name: '',
                description: ''
            },

        })
    }
    /*
    * If everything went as expected load inputted data
    */
    componentDidMount() {
        this.loadData()
    }
    /*
    * Load the data given by the user
    */
    loadData() {
        const currInstance = this;
        axios.get(APP_URLS.ALLTAGS_LIST, {
            responseType: 'json'
        }).then(function (resp) {
            const response = resp.data;
            currInstance.setState({
                creatorRows: response['creators'],
                keywordRows: response['keywords'],
                subjectRows: response['subjects'],
                coverageRows: response['coverages'],
                workareaRows: response['workareas'],
                languageRows: response['languages'],
                catalogerRows: response['catalogers'],
            })
        }).catch(function (error) {
            console.log(error);
            // TODO : Show the error message.
        });
    }
    /*
    * Make rows with all the data for a file
    */
    tableRowComponent(obj, menuName) {
        const { row, children } = obj;
        return (<TableRow onContextMenu={evt => this.handleTagsRightClick(evt, row, menuName)}>{children}</TableRow>);
    }
    /*
    * Method to handle right clicks
    */
    handleTagsRightClick(evt, row, menuName) {
        this.setState({
            selectedTag: row,
            [menuName]: {

                selectedTag: row,
                AnchorPos: { top: evt.clientY, left: evt.clientX }
            }
        });
        evt.preventDefault();

    }

    /*
    * Method to help deleting metadata
    */
    deleteTagCallback(deletedItemId) {
        var tagDataKey = this.state.currentPanel + "Rows";
        this.setState((prevState, props) => {
            const newState = {
                [tagDataKey]: prevState[tagDataKey],
                message: 'Delete successful',
                messageType: 'info'
            }
            for (var i = 0; i < newState[tagDataKey].length; i++) {
                if (newState[tagDataKey][i].id == deletedItemId) {
                    newState[tagDataKey].splice(i, 1);
                    break;
                }
            }

            return newState;
        });
    }
    /*
    * Delete a metadata file
    */
    deleteTag() {
        const selectedTagId = this.state.selectedTag.id;
        const targetUrl = this.state.detailUrl(selectedTagId);
        const currentInstance = this;
        axios.delete(targetUrl, {
            responseType: 'json'
        }).then(function (response) {
            currentInstance.deleteTagCallback(selectedTagId);
        }).catch(function (error) {
            console.error("Error in deleting the meta data", error);
        })
    }
    /*
    * Change the current state when a menu is closed
    */
    handleMenuClose(evt, menuName) {
        this.setState({
            [menuName]: {
                selectedTag: null,
                AnchorPos: null
            }
        });
    }
    /*
    * Save the info given by the user and create a row
    */
    saveTagCallback(savedTag, saveType) {
        var tagDataKey = this.state.currentPanel + "Rows";

        this.setState((prevState, props) => {
            const newState = {
                [tagDataKey]: prevState[tagDataKey],
                message: 'Save successful',
                messageType: 'info',
                currentView: 'manage'
            };

            if (saveType == TAG_SAVE_TYPE.CREATE) {
                const newTag = {
                    id: savedTag.id,
                    name: savedTag.name,
                    description: savedTag.description
                };
                newState[tagDataKey].push(newTag);

            } else if (saveType == TAG_SAVE_TYPE.UPDATE) {
                newState[tagDataKey].forEach(eachTag => {
                    if (eachTag.id == savedTag.id) {
                        eachTag.name = savedTag.name;
                        eachTag.description = savedTag.description;
                    }
                });
            }

            return newState;
        });

    }
    /*
    * Edit a specific file
    */
    handleTagEdit() {
        const selectedTag = this.state.selectedTag;
        
        const currentInstance = this;
        this.setState({
            currentView: 'addTag',
            selectedTag: {
                id: selectedTag.id,
                name: selectedTag.name,
                description: selectedTag.description
            }
        })
    }
    /*
    * Render the metadata page
    */
    render() {
        return (
		<MuiThemeProvider theme={theme}>
            <Grid container spacing={0}>
                <Grid item xs={4}>
                    {/* <Button variant="contained" color="primary" onClick={e => {this.setCurrentView('manage')}}>
            Manage MetaData
            </Button> */}

                </Grid>
                {this.state.currentView == 'manage' && (
					
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <ExpansionPanel expanded={this.state.expanded === 'creator'} onChange={this.handleChange('creator')} onClick={e => { this.handleAccordionClick('creator') }}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} onClick={e => { this.setUrls(APP_URLS.CREATORS_LIST, APP_URLS.CREATORS_DETAIL) }}>
                                    <Typography variant="h6" color="primary" className={styles.paragraph}>Creators</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container>
                                        <Grid item>

                                        </Grid>
                                        <DataGrid
                                            rows={this.state.creatorRows}
                                            columns={this.state.creatorColumns}
                                        >
                                            <FilteringState defaultFilters={[]} columnExtensions={[{ columnName: 'name', filteringEnabled: true }]} />
                                            <IntegratedFiltering />
                                            <PagingState defaultCurrentPage={0} defaultPageSize={10} />
                                            <IntegratedPaging />
                                            <Table rowComponent={obj => { return this.tableRowComponent(obj, 'selectedTagsMenu') }} />
                                            <TableHeaderRow />
                                            <TableFilterRow />
                                            <PagingPanel pageSizes={[5, 10, 20]} />

                                        </DataGrid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={this.state.expanded === 'coverage'} onChange={this.handleChange('coverage')} onClick={e => { this.handleAccordionClick('coverage') }}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} onClick={e => { this.setUrls(APP_URLS.COVERAGES_LIST, APP_URLS.COVERAGES_DETAIL) }}>
                                    <Typography variant="h6" color="primary" className={styles.paragraph}>Coverages</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container>
                                        <Grid item>
                                            <Button variant="contained" color="primary" onClick={e => { this.addNewTag('Coverages') }}>
                                                Add New
            </Button>
                                        </Grid>
                                        <DataGrid
                                            rows={this.state.coverageRows}
                                            columns={this.state.coverageColumns}
                                        >
                                            <FilteringState defaultFilters={[]} columnExtensions={[{ columnName: 'name', filteringEnabled: true }]} />
                                            <IntegratedFiltering />
                                            <PagingState defaultCurrentPage={0} defaultPageSize={10} />
                                            <IntegratedPaging />
                                            <Table rowComponent={obj => { return this.tableRowComponent(obj, 'selectedTagsMenu') }} />
                                            <TableHeaderRow />


                                            <TableFilterRow />
                                            <PagingPanel pageSizes={[5, 10, 20]} />
                                        </DataGrid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={this.state.expanded === 'subject'} onChange={this.handleChange('subject')} onClick={e => { this.handleAccordionClick('subject') }}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} onClick={e => { this.setUrls(APP_URLS.SUBJECTS_LIST, APP_URLS.SUBJECTS_DETAIL) }}>
                                    <Typography variant="h6" color="primary" className={styles.paragraph}>Subjects</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container>
                                        <Grid item>
                                            <Button variant="contained" color="primary" onClick={e => { this.addNewTag('Subjects') }}>
                                                Add New
            </Button>
                                        </Grid>
                                        <DataGrid
                                            rows={this.state.subjectRows}
                                            columns={this.state.subjectColumns}
                                        >
                                            <FilteringState defaultFilters={[]} columnExtensions={[{ columnName: 'name', filteringEnabled: true }]} />
                                            <IntegratedFiltering />
                                            <PagingState defaultCurrentPage={0} defaultPageSize={10} />
                                            <IntegratedPaging />
                                            <Table rowComponent={obj => { return this.tableRowComponent(obj, 'selectedTagsMenu') }} />
                                            <TableHeaderRow />
                                            <TableFilterRow />
                                            <PagingPanel pageSizes={[5, 10, 20]} />
                                        </DataGrid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={this.state.expanded === 'keyword'} onChange={this.handleChange('keyword')} onClick={e => { this.handleAccordionClick('keyword') }}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} onClick={e => { this.setUrls(APP_URLS.KEYWORDS_LIST, APP_URLS.KEYWORDS_DETAIL) }}>
                                    <Typography variant="h6" color="primary" className={styles.paragraph}>Keywords</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container>
                                        <Grid item>

                                        </Grid>
                                        <DataGrid
                                            rows={this.state.keywordRows}
                                            columns={this.state.keywordColumns}
                                        >
                                            <FilteringState defaultFilters={[]} columnExtensions={[{ columnName: 'name', filteringEnabled: true }]} />
                                            <IntegratedFiltering />
                                            <PagingState defaultCurrentPage={0} defaultPageSize={10} />
                                            <IntegratedPaging />
                                            <Table rowComponent={obj => { return this.tableRowComponent(obj, 'selectedTagsMenu') }} />
                                            <TableHeaderRow />
                                            <TableFilterRow />
                                            <PagingPanel pageSizes={[5, 10, 20]} />

                                        </DataGrid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={this.state.expanded === 'workarea'} onChange={this.handleChange('workarea')} onClick={e => { this.handleAccordionClick('workarea') }}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} onClick={e => { this.setUrls(APP_URLS.WORKAREAS_LIST, APP_URLS.WORKAREAS_DETAIL) }}>
                                    <Typography variant="h6" color="primary" className={styles.paragraph}>Work Areas</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container>
                                        <Grid item>
                                            <Button variant="contained" color="primary" onClick={e => { this.addNewTag('Work Areas') }}>
                                                Add New
            </Button>
                                        </Grid>
                                        <DataGrid
                                            rows={this.state.workareaRows}
                                            columns={this.state.workareaColumns}
                                        >
                                            <FilteringState defaultFilters={[]} columnExtensions={[{ columnName: 'name', filteringEnabled: true }]} />
                                            <IntegratedFiltering />
                                            <PagingState defaultCurrentPage={0} defaultPageSize={10} />
                                            <IntegratedPaging />
                                            <Table rowComponent={obj => { return this.tableRowComponent(obj, 'selectedTagsMenu') }} />
                                            <TableHeaderRow />
                                            <TableFilterRow />
                                            <PagingPanel pageSizes={[5, 10, 20]} />
                                        </DataGrid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={this.state.expanded === 'language'} onChange={this.handleChange('language')} onClick={e => { this.handleAccordionClick('language') }}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} onClick={e => { this.setUrls(APP_URLS.LANGUAGES_LIST, APP_URLS.LANGUAGES_DETAIL)}}>
                                    <Typography variant="h6" color="primary" className={styles.paragraph}>Languages</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container>
                                        <Grid item>
                                            <Button variant="contained" color="primary" onClick={e => { this.addNewTag('Languages') }}>
                                                Add New
            </Button>
                                        </Grid>
                                        <DataGrid
                                            rows={this.state.languageRows}
                                            columns={this.state.languageColumns}
                                        >
                                            <FilteringState defaultFilters={[]} columnExtensions={[{ columnName: 'name', filteringEnabled: true }]} />
                                            <IntegratedFiltering />
                                            <PagingState defaultCurrentPage={0} defaultPageSize={10} />
                                            <IntegratedPaging />
                                            <Table rowComponent={obj => { return this.tableRowComponent(obj, 'selectedTagsMenu') }} />
                                            <TableHeaderRow />
                                            <TableFilterRow />
                                            <PagingPanel pageSizes={[5, 10, 20]} />
                                        </DataGrid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={this.state.expanded === 'cataloger'} onChange={this.handleChange('cataloger')} onClick={e => { this.handleAccordionClick('cataloger') }}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} onClick={e => { this.setUrls(APP_URLS.CATALOGERS_LIST, APP_URLS.CATALOGERS_DETAIL) }}>
                                    <Typography variant="h6" color="primary" className={styles.paragraph}>Catalogers</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container>
                                        <Grid item><Button variant="contained" color="primary" onClick={e => { this.addNewTag('Catalogers') }}>
                                            Add New
            </Button>
                                        </Grid>
                                        <DataGrid
                                            rows={this.state.catalogerRows}
                                            columns={this.state.catalogerColumns}
                                        >
                                            <FilteringState defaultFilters={[]} columnExtensions={[{ columnName: 'name', filteringEnabled: true }]} />
                                            <IntegratedFiltering />
                                            <PagingState defaultCurrentPage={0} defaultPageSize={10} />
                                            <IntegratedPaging />
                                            <Table rowComponent={obj => { return this.tableRowComponent(obj, 'selectedTagsMenu') }} />
                                            <TableHeaderRow />
                                            <TableFilterRow />
                                            <PagingPanel pageSizes={[5, 10, 20]} />
                                        </DataGrid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <Menu
                                id="selected-tags-menu"
                                anchorPosition={this.state.selectedTagsMenu.AnchorPos}
                                anchorReference={'anchorPosition'}
                                open={Boolean(this.state.selectedTagsMenu.AnchorPos)}
                                onClose={evt => { this.handleMenuClose(evt, 'selectedTagsMenu') }}
                            >
                                <MenuItem
                                    onClick={currentView => {
                                        this.handleTagEdit();
                                    }}

                                >
                                    Edit
                    </MenuItem>
                                <MenuItem
                                    onClick={evt => {
                                        this.confirmDeleteTag();
                                        this.handleMenuClose(evt, 'selectedTagsMenu');
                                    }}
                                >
                                    Delete
                    </MenuItem>
                            </Menu>
                        </Grid>
                        <Dialog
                            open={this.state.confirmDelete}
                            onClose={this.closeConfirmDialog}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Confirm Delete?"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure you want to delete this metadata {this.state.name}?
                        </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.closeConfirmDialog} color="primary">
                                    No
                        </Button>
                                <Button onClick={evt => { this.closeConfirmDialog(); this.deleteTag(); }} color="primary" autoFocus>
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

                    </Grid>


                )}
                {
                    this.state.currentView == 'addTag' &&
                    <TagCreation tag={this.state.selectedTag} title={this.state.currentTitle} onSave={this.saveTagCallback}
                        onCancel={() => this.setCurrentView('manage')} listUrl={this.state.listUrl}
                        detailUrl={this.state.detailUrl} />
                }

            </Grid>
			</MuiThemeProvider>
        )



    }
    /*
    * Close the snackbar
    */
    handleCloseSnackbar() {
        this.setState({
            message: null,
            messageType: 'info'
        })
    }
}

export default withStyles(styles)(TagManagementComponent);
