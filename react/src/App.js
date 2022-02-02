import React, {Component, useState } from 'react'
import './App.css'
import { CardContent, CardActions, Card, Container, Button, withTheme, Grid} from '@mui/material';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DatePicker from '@mui/lab/DatePicker'; 
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Navbar from './Components/navbar'
import { Input } from '@mui/material';
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material//AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    root : {
        width: '100%',
    },
    buttonCSV: {
        color: '#F7F7F7',
        background: '#0080FF',
        textTransform: 'capitalize',
        border: '1px solid transparent',
        width: '100%',
        margin: 'auto',
        [theme.breakpoints.up('xl')]:{
            width: '1536px'
        },
        [theme.breakpoints.down('xl')]:{
            width : '100%'
        },
        "&:hover": {
            border: '1px solid black',
            background: '#0080FF',
            filter: 'brightness(95%)'
        }
    },
    buttonText: {
        color: '#F7F7F7',
        background: 'black',
        textTransform: 'capitalize',
        "&:hover": {
            backgroundColor: 'black',
        }
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    grid:{
        margin: 'auto',
        height: '100%',
        [theme.breakpoints.up('xl')]:{
            width: '1536px'
        },
    },
    gridItem:{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',    
        marginBottom: '30px',
        
    },
    gridItemLeft:{
        marginBottom: '30px',
        paddingRight: '15px',
    },
    gridItemRight:{
        marginBottom: '30px',
        paddingLeft: '15px',
    },
    inputCard :{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',   
    },
    inputCardAction :{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        
    },
    cardHeight :{
        height: '100%'
    },
    uploadImage:{
        fontSize: '100px'
    },
    helpfulLinks :{
        color: 'White'
    },
    table : {
        width: '1500px'
    },
    taxInformation : {
        marginTop: '30px',
        marginBottom: '30px',       
    },
    disabledAccordion: {
        backgroundColor : '#fff !important',
    },
    disabledAccordionSummary: {
        opacity : '1 !important'
    },
    moreDetail :{
        marginLeft: '0.5em'
    },
}));
function CreateTable(rows ,columns, setColumns, setData){
    setColumns(columns);
    setData(rows);
}

function UserInput(){
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [selectedDate, handleDateChange] = useState(new Date());
    const [uploaded, setUploaded] = useState(false);
    const [shakepayWallet, setShakepayWallet] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorFile, setErrorFile] = useState(false);
    const [errorEth, setErrorEth] = React.useState(false);
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const [taxInfo, setTaxInfo] = useState({});
    const [totals, setTotals] = useState({});

    let today = new Date();

    let year = today.getFullYear();
    let month = today.getMonth();
    let day = today.getDate();
    let minDate = new Date(year - 5, month, day);
    let maxDate = today;

    let content;
    const classes = useStyles();
    if(Object.keys(taxInfo).length === 0){
        content = 
            <Grid container className = {classes.grid} alignItems="stretch">
                <Grid item xs = {12} className = {classes.gridItem}>
                    <Card>
                        <Button className = {classes.buttonCSV}
                            variant = "contained"
                            component = "label"
                        >
                            <CardContent  className = {classes.inputCard}>
                                <FileUploadIcon className={classes.uploadImage}/>
                                <CardActions className= {classes.inputCardAction}>
                                    <Button className = {classes.buttonText}
                                        variant = "contained"
                                        component = "label"
                                    >
                                        Upload your Shakepay CSV file
                                        <input
                                            type = "file"
                                            onChange={event => {
                                                setSelectedFile(event.target.files[0]);
                                                setFileName(event.target.files[0].name);
                                            }}
                                            hidden
                                        />
                                    </Button>                                
                                </CardActions>
                                <a href="https://help.shakepay.com/en/articles/3336094-where-can-i-see-my-full-transaction-history-on-shakepay" target="_blank" className = {classes.helpfulLinks}>
                                How to get Shakepay CSV</a>                                                            
                            </CardContent>
                            <input
                                type = "file"
                                onChange={event => {
                                    setSelectedFile(event.target.files[0]);
                                    setFileName(event.target.files[0].name);
                                }}
                                hidden
                            />

                        </Button>
                    </Card>
                </Grid>
                <Grid item xs = {12}>
                    {fileName ? "Selected File: " + fileName : "Selected File:"} 
                </Grid>
                
                <Grid item xs = {12}>
                    <Button className = {classes.buttonText} variant="contained" color= "primary" onClick={() =>
                        Upload(selectedFile, wallet, shakepayWallet, setColumns, setData, setTaxInfo, setLoading, setShakepayWallet, setTotals, setError, selectedDate, setErrorEth, setErrorFile)}>
                            Submit </Button>
                </Grid>

                <Grid item xs = {6} className = {classes.gridItemLeft}>
                    <Card className = {classes.cardHeight}>
                        <CardContent>
                            Advance Options
                            <CardActions>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label= "Year"
                                            value={selectedDate}
                                            onChange={(newValue) => {
                                                handleDateChange(newValue);
                                            }}
                                            views={['year'] }
                                            minDate= {minDate}
                                            maxDate= {maxDate}
                                            renderInput={(params) => <TextField {...params} helperText={null} />}
                                        />
                                    </LocalizationProvider>                                
                            </CardActions>
                                <CardActions>
                                    <TextField fullWidth label="Ethereum Wallet Addresses" variant="outlined" 
                                    value={wallet} onChange= {(event) => setWallet(event.target.value)} />
                                </CardActions>
                                <CardActions>
                                <TextField fullWidth label="Shakepay Ethereum Wallet Address" variant="outlined" 
                                    value={shakepayWallet} onChange= {(event) => setShakepayWallet(event.target.value)} />
                                </CardActions>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs = {6} className = {classes.gridItemRight}>
                    <Card className = {classes.cardHeight}>
                        <CardContent>
                            This is a tax calculator for the crypto trading platform, Shakepay. Upload your csv file from Shakepay.
                            Integration with Ethereum blockchain is available under Advance Options. 
                        </CardContent>
                    </Card>                                           
                </Grid>
                <Grid item xs = {12}>
                    <Button className = {classes.buttonText} variant="contained" color= "primary" onClick={() =>
                        Upload(selectedFile, wallet, shakepayWallet, setColumns, setData, setTaxInfo, setLoading, setShakepayWallet, setTotals, setError, selectedDate, setErrorEth, setErrorFile)}>
                            Submit </Button>
                </Grid>
            </Grid>
    }
    else if(Object.keys(taxInfo).length > 0){
        content = <Grid container className = {classes.grid}>           
            <Grid item xs={12} className = {classes.taxInformation}>
                <Button className = {classes.buttonText} variant="contained" color= "primary" onClick={() => 
                    Reset(setFileName, setWallet, setShakepayWallet ,setColumns, setData, setTaxInfo, setLoading, handleDateChange, setUploaded)}>
                    Go Back 
                </Button>
                <Card className = {classes.taxInformation}>
                    <CardContent>
                        <Accordion disabled className = {classes.disabledAccordion}>
                            <AccordionSummary
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            className = {classes.disabledAccordionSummary}
                            >
                                <Typography>
                                    Income: {taxInfo.incomeGain}
                                </Typography>
                            </AccordionSummary>
                        </Accordion>
                        <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <Typography>
                               Capital gain: {taxInfo.capitalGain}
                           </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                           <Typography className={classes.moreDetail}>
                            BTC
                            <Typography>
                                Total BTC: {taxInfo.totalNumberBTC}
                            </Typography>
                            <Typography>
                               Total Sale: {taxInfo.totalSalePriceBTC}
                            </Typography>
                            <Typography>
                               Total Cost: {taxInfo.totalCostBTC}
                            </Typography>
                            <Typography>
                               Total Fees: {taxInfo.totalFeesBTC}
                            </Typography>
                            <Typography>
                               Total Gain: {taxInfo.totalGainsBTC}
                            </Typography>
                           </Typography>
                            <Typography className={classes.moreDetail}>
                            ETH
                            <Typography>
                               Total ETH: {taxInfo.totalNumberETH}
                            </Typography>
                            <Typography>
                               Total Sale: {taxInfo.totalSalePriceETH}
                            </Typography>
                            <Typography>
                               Total Cost: {taxInfo.totalCostETH}
                            </Typography>
                            <Typography>
                               Total Fees: {taxInfo.totalFeesETH}
                            </Typography>
                            <Typography>
                               Total Gain: {taxInfo.totalGainsETH}
                            </Typography>
                            </Typography>
                         </AccordionDetails>                            
                        </Accordion>                    
                    </CardContent>
                </Card>

            </Grid>
        </Grid>
    }
    return (
        <div className = {classes.grid}>
            {content}
        </div>
    )
}

function Reset(setFileName, setWallet, setShakepayWallet ,setColumns, setData, setTaxInfo, setLoading, handleDateChange, setUploaded, setTotals){
    setTaxInfo({});
    setTotals({});    
}
function Upload(selectedFile, wallet, shakepayWallet ,setColumns, setData, setTaxInfo,setLoading, setShakepayWallet, setTotals, setError, selectedDate, setErrorEth, setErrorFile){
    if(selectedFile == null || selectedDate == null){
        setError(true)
        setLoading(false)
    }
    else if((wallet != null && shakepayWallet == null) || (wallet != null && shakepayWallet == "") ){
        setErrorEth(true)
        setLoading(false)
    }
    else{
        setError(false)
        setErrorEth(false)
        setErrorFile(false)
        setLoading(true)
        const payload = new FormData()
        payload.append('file', new Blob([selectedFile],{
            type: 'text/csv'
        }));
        if(!wallet){
            payload.append('wallet', "0")
        }
        else{
            payload.append('wallet', wallet)
        }
        if(!shakepayWallet){
            payload.append('shakepayWallet', "0")
        }
        else{
            payload.append('shakepayWallet', shakepayWallet)
        }
        
        payload.append('year', selectedDate.getFullYear())
        const qs = require('qs');
        axios.post("/api/tax", payload, {
            headers: {
                "Content-Type": "multipart/form-data",
              },
            }).then(res => {
                    console.log(res)
                    if(res.data.error == "true"){
                        setErrorFile(true)
                        setLoading(false)
                    }
                    else{
                        CreateTable(res.data.table ,res.data.columns, setColumns, setData);
                        const info = res.data.info
                        setTaxInfo({
                            incomeGain: info.incomeGain,
                            capitalGain: info.capitalGain,
                            totalNumberETH: info.totalNumberETH,
                            totalSalePriceETH: info.totalSalePriceETH,
                            totalCostETH: info.totalCostETH,
                            totalFeesETH: info.totalFeesETH,
                            totalGainsETH: info.totalGainsETH,
                            totalNumberBTC: info.totalNumberBTC,
                            totalSalePriceBTC: info.totalSalePriceBTC,
                            totalCostBTC: info.totalCostBTC,
                            totalFeesBTC: info.totalFeesBTC,
                            totalGainsBTC: info.totalGainsBTC
                            });
                        setTotals(res.data.totals);
                    }
                }).catch(function (error){
                    console.log(error)
                    alert("An error has occured, Could not read data sent back");
                    setError(false);
                    setErrorEth(false);
                    setErrorFile(false);
                    setLoading(false);
                })
    }
}
class App extends Component {

    render(){

        return (
        <div id = "website">
            <div id = "navbar">
                <Navbar/>
            </div>
            <div id = "content" >
                <ThemeProvider theme={theme}><UserInput/></ThemeProvider>
            </div>
            <div id = "footer">
                    <p>Powered By Coingecko API and Etherscan API</p>
            </div>       
        </div>
    );}

}

export default App;