import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Row, Col, Container, Form, AccordionCollapse } from 'react-bootstrap';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion } from "react-bootstrap";
import { connect } from 'react-redux';
import { useParams } from "react-router";
import { beforeTheme, createTheme, getTheme, updateTheme, gameThemeDetails, updateGameTheme } from "./Theme.action";
import ThemeAccordion from "./ThemeAccordion";
import validator from "validator";
import './detheme.css'
import { Link } from 'react-router-dom'


const AddTheme = (props) => {

    let { themeId } = useParams()
    let { gameThemeId } = useParams()

    let pathname = window.location.pathname
    
    //Accordian
    const [isActiveZero, setIsActiveZero] = useState("")
    const [isActiveOne, setIsActiveOne] = useState("")
    const [isActiveTwo, setIsActiveTwo] = useState("")
    const [isActiveThree, setIsActiveThree] = useState("")
    const [isActiveFour, setIsActiveFour] = useState("")
    const [isActiveFive, setIsActiveFive] = useState("")

    const [themeName, setThemeName] = useState("")
    const [themeNameMsg, setThemeNameMsg] = useState("")
    const [Id, setId] = useState(themeId ? themeId : "")
    const [prevGameId, setPrevGameId] = useState("")
    const [themeStatus, setThemeStatus] = useState(true)
    // const [themeModal, setThemeModal] = useState(false)


    const [coreColor, setCoreColor] = useState({
        backgroundGradient: {
            type: "gradient",
            value: [{ color: "" }, { color: "" }, { color: "" }]
        },

        mainColor: { type: "color", value: "" },
        mainColorOpacity: { type: "input", value: "", regex: "^(0+\\.?|0*\\.\\d+|0*1(\\.0*)?)$" },
        mainDividerColor: { type: "color", value: "" },
        secondaryColor: { type: "color", value: "" },
        secondaryColorOpacity: { type: "input", value: "", regex: "^(0+\\.?|0*\\.\\d+|0*1(\\.0*)?)$" },
        secondaryDividerColor: { type: "color", value: "" },
        tertiaryColor: { type: "color", value: "" },
        tertiaryColorOpacity: { type: "input", value: "", regex: "^(0+\\.?|0*\\.\\d+|0*1(\\.0*)?)$" },
        cellBackgroundColor: { type: "color", value: "" },
        profilePictureBackgroundColor: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
    })

    const [coreColorMsg, setCoreColorMsg] = useState({
        backgroundGradient: "App wide default background gradient if no background image is supplied (and while supplied background image is loading)",
        mainColor: "Primary view background color, ie: tab bar background.",
        mainColorOpacity: "Used where opacity is required (will replace given opacities for colors, not multiply)",
        mainDividerColor: "Used for background of Pending/Placeholder Avatar, and a few different dividers. (darker divider)",
        secondaryColor: "Secondary view color, ie: Match Select cell background",
        secondaryColorOpacity: "Used for borders of avatars, flags and checkboxes. (lighter divider)",
        secondaryDividerColor: "Used for borders of avatars, flags and checkboxes. (lighter divider)",
        tertiaryColor: "Tertiary view background color, ie: Trophy cell background",
        tertiaryColorOpacity: "Used where opacity is required (will replace given opacities for colors, not multiply)",
        cellBackgroundColor: "Primary cell background color.",
        profilePictureBackgroundColor: "Used for Profile section icons",
    })
    const [accentColor, setAccentColor] = useState({
        highlight: { type: "color", value: "" },
        tabHighlight: { type: "color", value: "" },
        tauntHighlightColor: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
        overlayEntryContainerGradient: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
        progressBarColor: { type: "color", value: "" },
        giftBoxHighlightColor: { type: "color", value: "" },
        sideMenuHighlightColor: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
        selectedCellBackgroundColor: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
        featuredMatchBarColor: { type: "color", value: "" }
    })
    const [accentColorMsg, setAccentColorMsg] = useState({
        highlight: "Color used to highlight views, ie: Player view on PLOW",
        tabHighlight: "Color for selected tab icon and text",
        tauntHighlightColor: "Gradient used for taunt bubbles and images.",
        overlayEntryContainerGradient: "Gradient used for match code and promo code entry backgrounds",
        progressBarColor: "Used for Z Regen Bar, Ticketz Tier bar, and trophy bars.",
        giftBoxHighlightColor: "Gift box highlight color for trophies and Z Regen bar",
        sideMenuHighlightColor: "Used as pressed state for side menu items.",
        selectedCellBackgroundColor: '',
        featuredMatchBarColor: "Background color used for bar highlighting tournaments to play"
    })
    const [buttonColors, setButtonColor] = useState({
        mainButtonColor: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
        secondaryButtonColor: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
        tertiaryButtonColor: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
        storeButtonColor: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
        playButtonColor: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
    })
    const [buttonColorsMsg, setButtonColorMsg] = useState({
        mainButtonColor: "Primary call to action background gradient",
        secondaryButtonColor: "Secondary call to action background gradient",
        tertiaryButtonColor: "Tertiary call to action background gradient",
        storeButtonColor: "Deposit tile background gradient",
        playButtonColor: "Match Select play button gradient (is reversed for pressed state)",
    })
    const [textColors, setTextColors] = useState({
        mainTextColor: { type: "color", value: "" },
        secondaryTextColor: { type: "color", value: "" },
        tertiaryTextColor: { type: "color", value: "" },
        linkTextColor: { type: "color", value: "" },
        mainButtonTextColor: { type: "color", value: "" },
        secondaryButtonTextColor: { type: "color", value: "" },
        tertiaryButtonTextColor: { type: "color", value: "" },
        sideMenuTextColor: { type: "color", value: "" }

    })
    const [textColorsMsg, setTextColorsMsg] = useState({
        mainTextColor: "Primary text color for the Skillz UI, also used to theme icons that are part of text ie: tab bar text",
        secondaryTextColor: "Secondary text color for the Skillz UI ie: Trophy Cells",
        tertiaryTextColor: "Tertiary text color for the Skillz UI",
        linkTextColor: "Used for links",
        mainButtonTextColor: "Primary call to action color",
        secondaryButtonTextColor: "Secondary call to action color",
        tertiaryButtonTextColor: "Tertiary call to action color",
        sideMenuTextColor: "Side Menu Text Color"

    })
    const [artwork, setArtWork] = useState({
        backgroundImage: { type: "file", value: "" },
        cashPrizeImage: { type: "file", value: "" },
        cashPrizeBackgroundColor: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
        virtualPrizeImage: { type: "file", value: "" },
        virtualPrizeBackgroundColor: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
        ticketzPrizeImage: { type: "file", value: "" },
        ticketzPrizeBackgroundColor: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
        eventPrizeImage: { type: "file", value: "" },
        eventPrizeBackgroundColor: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
        bracketedCashPrizeImage: { type: "file", value: "" },
        bracketCashPrizeBackgroundColor: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
        bracketedVirtualPrizeImage: { type: "file", value: "" },
        bracketVirtualPrizeBackgroundColor: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
        bracketedEventPrizeImage: { type: "file", value: "" },
        bracketEventPrizeBackgroundColor: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        }
    })
    const [artworkMsg, setArtWorkMsg] = useState({
        backgroundImage: "Full screen background image used throughout the SDK. Should be 1242×2208 jpg (for native resolution, 640x1138 for non-native resolution.).This value cannot be null! File must be less than 1 MB.",
        cashPrizeImage: "Background image used for match select cash prize container. Should be 240x240 jpg. File must be less than 500 KB.",
        cashPrizeBackgroundColor: "Prize view background on match select for cash bracket matches.Note: Prize Images will Overwrite Prize Background Colors",
        virtualPrizeImage: "Background image used for match select practice currency bracket tournaments prize container. Should be 240x240 jpg. File must be less than 500 KB.",
        virtualPrizeBackgroundColor: "Prize view background on match select for practice currency bracket matches.Note: Prize Images will Overwrite Prize Background Colors",
        ticketzPrizeImage: "Background Image used for match select ticketz prize container. Should be 240x240 jpg. File must be less than 500 KB.",
        ticketzPrizeBackgroundColor: "Prize view background on match select for ticketz currency matches.Note: Prize Images will Overwrite Prize Background Colors",
        eventPrizeImage: "Background image used for match select live event bracket tournaments prize container. Should be 240x240 jpg. File must be less than 500 KB.",
        eventPrizeBackgroundColor: "Prize view background on match select for live event bracket matches.Note: Prize Images will Overwrite Prize Background Colors",
        bracketedCashPrizeImage: "Background image used for match select cash bracket tournaments prize container. Should be 240x240 jpg. File must be less than 500 KB.",
        bracketCashPrizeBackgroundColor: "Prize view background on match select for cash bracket matches.Note: Prize Images will Overwrite Prize Background Colors",
        bracketedVirtualPrizeImage: "Background image used for match select practice currency bracket tournaments prize container. Should be 240x240 jpg. File must be less than 500 KB.",
        bracketVirtualPrizeBackgroundColor: "Prize view background on match select for practice currency bracket matches.Note: Prize Images will Overwrite Prize Background Colors",
        bracketedEventPrizeImage: "Background image used for match select live event bracket tournaments prize container. Should be 240x240 jpg. File must be less than 500 KB.",
        bracketEventPrizeBackgroundColor: "Prize view background on match select for live event bracket matches.Note: Prize Images will Overwrite Prize Background Colors",
    })
    const [advanced, setAdvanced] = useState({
        cellAlternateBackgroundColor: { type: "color", value: "" },
        OpacityNone: { type: "input", value: "", regex: "^(0+\\.?|0*\\.\\d+|0*1(\\.0*)?)$" },
        playerActivityIndicatorColor: { type: "color", value: "" },
        statusBarViewBackgroundColor: { type: "color", value: "" },
        highlightTurnBasedWinColor: { type: "color", value: "" },
        textColorFour: { type: "color", value: "" },
        textColorError: { type: "color", value: "" },
        textColorCash: { type: "color", value: "" },
        textColorZ: { type: "color", value: "" },
        textColorTicketz: { type: "color", value: "" },
        textColorMedals: { type: "color", value: "" },
        textColorDepositTile: { type: "color", value: "" },
        textTicketzGradient: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
        textCashGradient: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
        textCashGradient: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
        textZGradient: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
        // Scale Grading
        sidePanelBlurStyle: { type: "input", value: "", regex: "^[0-1]$" },
        statusBarContentStyle: { type: "input", value: "", regex: "^[0-1]$" },
        viewCornerRadiusPrimary: { type: "input", value: "", regex: "^[1-9][0-9]?$|^100$" },
        viewCornerRadiusSecondary: { type: "input", value: "", regex: "^[1-9][0-9]?$|^100$" },
        viewCornerRadiusTertiary: { type: "input", value: "", regex: "^[1-9][0-9]?$|^100$" },
        viewBorderWidthPrimary: { type: "input", value: "", regex: "^[1-9][0-9]?$|^100$" },
        viewBorderWidthSecondary: { type: "input", value: "", regex: "^[1-9][0-9]?$|^100$" },
        viewBorderWidthTertiary: { type: "input", value: "", regex: "^[1-9][0-9]?$|^100$" },
        //colors Again
        checkMarkColor: { type: "color", value: "" },
        cashIconGradient: {
            type: "gradient", value: [{ color: "" }, { color: "" }, { color: "" }]
        },

        practiceCurrencyIconGradient: {
            type: "gradient", value: [{ color: "" }, { color: "" }]
        },
        pointsPrizeGradient: {
            type: "gradient", value: [{ color: "" }, { color: "" }, { color: "" }]
        },
        //Dollar Field
        practiceCurrencyString: { type: "input", value: "" },
        //image
        practiceCurrencySimpleIconURI: { type: "file", value: "" },    // 🖼️
        practiceCurrencyFullIconLargeURI: { type: "file", value: "" }, // 🖼️
        realTimeMatchIcon: { type: "file", value: "" }                  // 🖼️
    })
    const [advancedMsg, setAdvancedMsg] = useState({
        cellAlternateBackgroundColor: "Alternative cell background color, for tables with alternating colors ie: taunts/leaderboards.",
        OpacityNone: "Used sparingly where total opaqueness is required",
        playerActivityIndicatorColor: "Color of dot indicator player is playing now for live event",
        statusBarViewBackgroundColor: "Background view of status bar, (Status bar text can only be black or white)",
        highlightTurnBasedWinColor: "Highlight used for round winner in turn based matches",
        textColorFour: "ie: VS <Username>; on Match Stream cells",
        textColorError: "Used for error text",
        textColorCash: "Used for displaying cash values",
        textColorZ: "Used for displaying practice currency values",
        textColorTicketz: "Used for Ticketz prizes and values",
        textColorMedals: "Used for leaderboard medals when they need to be a solid color",
        textColorDepositTile: "Used for deposit amounts on Store",
        textTicketzGradient: "Gradient used for ticketz currency text (and some views)",
        textCashGradient: "Gradient used for cash currency text (and some views)",
        textZGradient: "Gradient used for practice currency text (and some views)",
        // Scale Grading
        sidePanelBlurStyle: "Defines side menu background style. 1 for bright white blur, 0 for dark blur.",
        statusBarContentStyle: "Defines status bar text color. 1 for white text, 0 for dark text.",
        viewCornerRadiusPrimary: "Determines roundness of corners. ie: Most buttons. Between 0 to 100 % of button roundness is allowed",
        viewCornerRadiusSecondary: "Determines roundness of corners. ie: Deposit Tiles. Between 0 to 100 % of button roundness is allowed",
        viewCornerRadiusTertiary: "Determines roundness of corners. ie: Cells/Inner Containers. Between 0 to 100 % of button roundness is allowed",
        viewBorderWidthPrimary: "Determines width of view stroke. ie: Entry Offers/Ticketz Tiers. Between 0 to 100 % of width roundness is allowed",
        viewBorderWidthSecondary: "Determines roundness of corners. ie: Help Center Views. Between 0 to 100 % of width roundness is allowed",
        viewBorderWidthTertiary: "Determines width of view stroke. ie: Avatars. Between 0 to 100 % of width roundness is allowed",
        //colors Again
        checkMarkColor: "Check mark color",
        cashIconGradient: "Used for Cash leaderboard trophy icon.",
        practiceCurrencyIconGradient: "Used for Practice leaderboard trophy icon.",
        pointsPrizeGradient: "Used on completed live event PLOW for player prize.",
        //Dollar Field
        practiceCurrencyString: "Must be a single character, can be emoji or special character",
        //image
        practiceCurrencySimpleIconURI: "Should be flat icon (single color) representing your currency, may have color applied to it in certain use cases. Should be ~100x100px png. File must be less than 500 KB.",    // 🖼️
        practiceCurrencyFullIconLargeURI: "Can be a complex skeumorphic icon representing your currency. Should be ~200x200px png. File must be less than 500 KB.", // 🖼️
        realTimeMatchIcon: "Custom image for the prize box tile for Real Time Matches. Should be ~200x200px png. File must be less than 500 KB. File must be less than 500 KB."                  // 🖼️
    })
    const [error, setError] = useState({})
    const [loader, setLoader] = useState(true)
    const [viewCheck, setViewCheck] = useState(false)


    useEffect(() => {
        window.scroll(0, 0)
        if (window.location.href.split('/')[4] === 'view-theme') {
            setViewCheck(true)
        }
        if (pathname === `/admin/edit-gametheme/${gameThemeId}`) {
            props.gameThemeDetails(gameThemeId)
            setId(gameThemeId)
        }
        setLoader(false)

    }, [])
    //gameId
    useEffect(() => {
        if (props.themes.getGameThemeAuth) {
            
            const { name, coreColor, accentColor, buttons, text, artwork, advanced, status, gameId } = props.themes.gameTheme
            setCoreColor(JSON.parse(coreColor))
            setAccentColor(JSON.parse(accentColor))
            setButtonColor(JSON.parse(buttons))
            setTextColors(JSON.parse(text))
            setArtWork(JSON.parse(artwork))
            setAdvanced(JSON.parse(advanced))
            setThemeName(name)
            setThemeStatus(status)
            
            setPrevGameId(gameId)
        }
    }, [props.themes.getGameThemeAuth])
    useEffect(() => {
        if (themeId) {
            setId(themeId)
            props.getTheme(themeId)
        }
    }, [themeId])
    useEffect(() => {
        if (props.themes.getThemeAuth) {
            
            const { name, coreColor, accentColor, buttons, text, artwork, advanced, status } = props.themes.theme.data[0]
            
            setCoreColor(JSON.parse(coreColor))
            setAccentColor(JSON.parse(accentColor))
            setButtonColor(JSON.parse(buttons))
            setTextColors(JSON.parse(text))
            setArtWork(JSON.parse(artwork))
            setAdvanced(JSON.parse(advanced))
            setThemeName(name)
            setThemeStatus(status)


            props.beforeTheme()
            setLoader(false)
        }
    }, [props.themes.getThemeAuth])

    //edit gameTheme
    useEffect(() => {
        if (props.themes.editGameThemeAuth) {
            props.beforeTheme()
            
            window.location.replace(`/admin/game-theme/${prevGameId}`)
        }
    }, [props.themes.editGameThemeAuth])
    //create_theme is completed
    useEffect(() => {
        if (props.themes.createThemeAuth) {
            props.beforeTheme()
            props.history.push('/theme')
        }
    }, [props.themes.createThemeAuth])

    //edit_theme is completed
    useEffect(() => {
        if (props.themes.editThemeAuth) {
            props.beforeTheme()
            props.history.push('/theme')
        }
    }, [props.themes.editThemeAuth])
    const validation = () => {
        // 
        // let temp = JSON.stringify(coreColor)
        // 
        let err = { coreColor: {}, accentColor: {}, buttonColors: {}, textColors: {}, artwork: {}, advanced: {} };
        let isValid = true;
        //coreColor
        for (var key in coreColor) {
            // 
            if (key) {
                if (coreColor[key].type === 'gradient') {
                    
                    err.coreColor[`${key}`] = [] // {back:[]}
                    for (var subKey in coreColor[key].value) {
                        
                        if (!coreColor[key].value[subKey].color) {
                            err.coreColor[`${key}`].push('It is Required'); //{backgrounGradientColor : {value : "yy"}}
                            isValid = false
                        }
                        else {
                            err.coreColor[`${key}`].push(''); //{backgrounGradientColor : {value : "yy"}}
                        }

                    }
                    // alert(JSON.stringify({"key ": key , " isValid ": isValid}))
                }
                else if (coreColor[key].type !== 'gradient') {
                    if (!coreColor[key].value) {
                        err.coreColor[`${key}`] = "It is Required";
                        isValid = false
                    }
                    // alert(JSON.stringify({"key ": key , " isValid ": isValid}))
                }
                // alert(JSON.stringify({"key ": key , " isValid ": isValid}))
            }
        }
        //accentColor
        for (var key in accentColor) {
            // 

            if (key) {
                if (accentColor[key].type === 'gradient') {
                    
                    err.accentColor[`${key}`] = [] // {back:[]}
                    for (var subKey in accentColor[key].value) {
                        
                        if (!accentColor[key].value[subKey].color) {
                            err.accentColor[`${key}`].push('It is Required'); //{backgrounGradientColor : {value : "yy"}}
                            isValid = false
                        }
                        else {
                            err.accentColor[`${key}`].push(''); //{backgrounGradientColor : {value : "yy"}}
                        }
                    }
                    // alert(JSON.stringify({"key ": key , " isValid ": isValid}))
                }
                else if (accentColor[key].type !== 'gradient') {
                    if (!accentColor[key].value) {
                        err.accentColor[`${key}`] = 'It is Required';
                        isValid = false
                    }
                    // alert(JSON.stringify({"key ": key , " isValid ": isValid}))
                }
                // alert(JSON.stringify({"key ": key , " isValid ": isValid}))
            }
        }
        //buttonColors
        for (var key in buttonColors) {
            // 
            if (key) {
                if (buttonColors[key].type === 'gradient') {
                    
                    err.buttonColors[`${key}`] = [] // {back:[]}
                    for (var subKey in buttonColors[key].value) {
                        
                        if (!buttonColors[key].value[subKey].color) {
                            err.buttonColors[`${key}`].push('It is Required'); //{backgrounGradientColor : {value : "yy"}}
                            isValid = false
                        }
                        else {
                            err.buttonColors[`${key}`].push(''); //{backgrounGradientColor : {value : "yy"}}
                        }
                    }
                    // alert(JSON.stringify({"key ": key , " isValid ": isValid}))
                }
                else if (buttonColors[key].type !== 'gradient') {
                    if (!buttonColors[key].value) {
                        err.buttonColors[`${key}`] = 'It is Required';
                        isValid = false
                    }
                    // alert(JSON.stringify({"key ": key , " isValid ": isValid}))
                }
            }
        }
        //textColors
        for (var key in textColors) {
            // 
            if (key) {
                if (textColors[key].type === 'gradient') {
                    
                    err.textColors[`${key}`] = [] // {back:[]}
                    for (var subKey in textColors[key].value) {
                        
                        if (!textColors[key].value[subKey].color) {
                            err.textColors[`${key}`].push('It is Required'); //{backgrounGradientColor : {value : "yy"}}
                            isValid = false
                        }
                        else {
                            err.textColors[`${key}`].push(''); //{backgrounGradientColor : {value : "yy"}}
                        }
                    }
                    // alert(JSON.stringify({"key ": key , " isValid ": isValid}))
                }
                else if (textColors[key].type !== 'gradient') {
                    if (!textColors[key].value) {
                        err.textColors[`${key}`] = 'It is Required';
                        isValid = false
                    }
                    // alert(JSON.stringify({"key ": key , " isValid ": isValid}))
                }
            }
        }
        //artwork
        for (var key in artwork) {
            // 
            if (key) {
                if (artwork[key].type === 'gradient') {
                    
                    err.artwork[`${key}`] = [] // {back:[]}
                    for (var subKey in artwork[key].value) {
                        
                        if (!artwork[key].value[subKey].color) {
                            err.artwork[`${key}`].push('It is Required'); //{backgrounGradientColor : {value : "yy"}}
                            isValid = false
                        }
                        else {
                            err.artwork[`${key}`].push(''); //{backgrounGradientColor : {value : "yy"}}
                        }
                    }
                    // alert(JSON.stringify({"key ": key , " isValid ": isValid}))
                }
                else if (artwork[key].type !== 'gradient') {
                    if (!artwork[key].value) {
                        err.artwork[`${key}`] = 'It is Required';
                        isValid = false
                    }
                    // alert(JSON.stringify({"key ": key , " isValid ": isValid}))
                }
            }
        }
        //advanced
        for (var key in advanced) {
            // 
            if (key) {
                if (advanced[key].type === 'gradient') {
                    
                    err.advanced[`${key}`] = [] // {back:[]}
                    for (var subKey in advanced[key].value) {
                        
                        if (!advanced[key].value[subKey].color) {
                            err.advanced[`${key}`].push('It is Required'); //{backgrounGradientColor : {value : "yy"}}
                            isValid = false
                        }
                        else {
                            err.advanced[`${key}`].push(''); //{backgrounGradientColor : {value : "yy"}}
                        }
                    }
                    // alert(JSON.stringify({"key ": key , " isValid ": isValid}))
                }
                else if (advanced[key].type !== 'gradient') {
                    if (!advanced[key].value) {
                        err.advanced[`${key}`] = 'It is Required';
                        isValid = false
                    }
                    // alert(JSON.stringify({"key ": key , " isValid ": isValid}))
                }
            }
        }
        if (validator.isEmpty(themeName.trim())) {
            // alert("Is it because of Name")
            setThemeNameMsg("Name is Required")
            isValid = false
        }
        // 
        setError(err)
        // alert(isValid)
        return isValid;
    }

    // on inputField Change
    const onChangeCoreColor = (e) => {
        let { name, value } = e.target
        let data = coreColor
        setCoreColor({ ...data, [name]: { type: "color", value: value } })
    }
    //
    const onChangeAccentColor = (e) => {
        let { name, value } = e.target
        let data = accentColor
        // data[`${name}`] = value
        setAccentColor({ ...data, [name]: { type: "color", value: value } })
    }
    const onChangeTextColors = (e) => {
        let { name, value } = e.target
        let data = textColors
        // data[`${name}`] = value
        setTextColors({ ...data, [name]: { type: "color", value: value } })
    }

    const onChangeButtonColors = (e) => {
        let { name, value } = e.target
        let data = buttonColors
        // data[`${name}`] = value
        setButtonColor({ ...data, [name]: { type: "color", value: value } })
    }

    const onChangeArtworkColors = (e) => {
        let { name, value } = e.target
        let data = artwork
        // data[`${name}`] = value
        setArtWork({ ...data, [name]: { type: "color", value: value } })
    }
    const onChangeAdvancedColors = (e) => {
        let { name, value } = e.target
        let data = advanced
        // data[`${name}`] = value
        setAdvanced({ ...data, [name]: { type: "color", value: value } })
    }

    const submit = () => {
        if (validation()) {
            //Hit the API here 
            
            creatTheme()
        }
        else {
            if (!error.coreColor) {
                //eventkey :0
                setIsActiveZero("0")
            }
            if (!error.accentColor) {
                //eventkey :1
                setIsActiveOne("1")
            }
            if (!error.buttonColors) {
                //eventkey : 2
                setIsActiveTwo("2")
            }
            if (!error.textColors) {
                //eventkey : 3
                setIsActiveThree("3")
            }
            if (!error.artwork) {
                //eventKey : 4
                setIsActiveFour("4")
            }
            if (!error.advanced) {
                //eventKey : 5
                setIsActiveFive("5")
            }
        }
    }

    const creatTheme = () => {
        if (Id) {
            //Update API Hit Here
            if (gameThemeId) {
                props.updateGameTheme(Id, { name: themeName, coreColor: JSON.stringify(coreColor), accentColor: JSON.stringify(accentColor), buttons: JSON.stringify(buttonColors), text: JSON.stringify(textColors), artwork: JSON.stringify(artwork), advanced: JSON.stringify(advanced), status: themeStatus })
            } else {
                
                props.updateTheme(Id, { name: themeName, coreColor: JSON.stringify(coreColor), accentColor: JSON.stringify(accentColor), buttons: JSON.stringify(buttonColors), text: JSON.stringify(textColors), artwork: JSON.stringify(artwork), advanced: JSON.stringify(advanced), status: themeStatus })
            }

        }
        else {
            
            props.createTheme({ name: themeName, coreColor: JSON.stringify(coreColor), accentColor: JSON.stringify(accentColor), buttons: JSON.stringify(buttonColors), text: JSON.stringify(textColors), artwork: JSON.stringify(artwork), advanced: JSON.stringify(advanced), status: themeStatus })
        }

    }
    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container>

                        <Row>
                            <Col md="12">
                                <Card className="pb-3 table-big-boy" >
                                    <Card.Header>
                                        <Card.Title as="h4">{Id ? "Update " : "Add "}Theme</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Form.Group>
                                            <label>Name<span className="text-danger"> *</span></label>
                                            <Form.Control
                                                value={themeName ? themeName : ''}
                                                onChange={(e) => {
                                                    setThemeName(e.target.value);
                                                }}
                                                placeholder="Name"
                                                type="text"
                                                disabled={viewCheck}
                                            ></Form.Control>
                                            <span className={themeNameMsg ? `` : `d-none`}>
                                                <label className="pl-1 text-danger">{themeNameMsg}</label>
                                            </span>
                                        </Form.Group>

                                        <Accordion defaultActiveKey="0" >
                                            <Card>
                                                <Accordion.Toggle className="accordion-toggle" as={Card.Header} eventKey="0" onClick={() => { isActiveZero === "0" ? setIsActiveZero("") : setIsActiveZero("0") }}>
                                                    Core Colors
                                                </Accordion.Toggle>
                                                <Accordion.Collapse eventKey="0">
                                                    <Card.Body >
                                                        <ul className="text-white">
                                                            <ThemeAccordion BigState={coreColor} setItem={setCoreColor} InputChange={onChangeCoreColor} notes={coreColorMsg} err={error?.coreColor} />
                                                        </ul>
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                        </Accordion>
                                        <Accordion activeKey={isActiveOne}>
                                            <Card>
                                                <Accordion.Toggle className="accordion-toggle" as={Card.Header} eventKey="1" onClick={() => { isActiveOne === "1" ? setIsActiveOne("") : setIsActiveOne("1") }}>
                                                    Accent Colors
                                                </Accordion.Toggle>
                                                <Accordion.Collapse eventKey="1">
                                                    <Card.Body>
                                                        <ul className="text-white">
                                                            <ThemeAccordion BigState={accentColor} setItem={setAccentColor} InputChange={onChangeAccentColor} notes={accentColorMsg} err={error?.accentColor} />
                                                        </ul>
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                        </Accordion>
                                        <Accordion activeKey={isActiveTwo}>
                                            <Card>
                                                <Accordion.Toggle className="accordion-toggle" as={Card.Header} eventKey="2" onClick={() => { isActiveTwo === "2" ? setIsActiveTwo("") : setIsActiveTwo("2") }}>
                                                    Buttons
                                                </Accordion.Toggle>
                                                <Accordion.Collapse eventKey="2">
                                                    <Card.Body>
                                                        <ul className="text-white">
                                                            <ThemeAccordion BigState={buttonColors} setItem={setButtonColor} InputChange={onChangeButtonColors} notes={buttonColorsMsg} err={error?.buttonColors} />
                                                        </ul>
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                        </Accordion>
                                        <Accordion activeKey={isActiveThree}>
                                            <Card>
                                                <Accordion.Toggle className="accordion-toggle" as={Card.Header} eventKey="3" onClick={() => { isActiveThree === "3" ? setIsActiveThree("") : setIsActiveThree("3") }}>
                                                    Text
                                                </Accordion.Toggle>
                                                <Accordion.Collapse eventKey="3">
                                                    <Card.Body>
                                                        <ul className="text-white">
                                                            <ThemeAccordion BigState={textColors} setItem={setTextColors} InputChange={onChangeTextColors} notes={textColorsMsg} err={error?.textColors} />
                                                        </ul>
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                        </Accordion>
                                        <Accordion activeKey={isActiveFour}>
                                            <Card>
                                                <Accordion.Toggle className="accordion-toggle" as={Card.Header} eventKey="4" onClick={() => { isActiveFour === "4" ? setIsActiveFour("") : setIsActiveFour("4") }}>
                                                    Artwork
                                                </Accordion.Toggle>
                                                <Accordion.Collapse eventKey="4">
                                                    <Card.Body>
                                                        <ul className="text-white">
                                                            <ThemeAccordion BigState={artwork} setItem={setArtWork} InputChange={onChangeArtworkColors} notes={artworkMsg} err={error?.artwork} />
                                                        </ul>
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                        </Accordion>
                                        <Accordion activeKey={isActiveFive}>
                                            <Card>
                                                <Accordion.Toggle className="accordion-toggle" as={Card.Header} eventKey="5" onClick={() => { isActiveFive === "5" ? setIsActiveFive("") : setIsActiveFive("5") }}>
                                                    Advanced
                                                </Accordion.Toggle>
                                                <Accordion.Collapse className="collapsed" eventKey="5">
                                                    <Card.Body>
                                                        <ul className="text-white">
                                                            <ThemeAccordion BigState={advanced} setItem={setAdvanced} InputChange={onChangeAdvancedColors} notes={advancedMsg} err={error?.advanced} />
                                                        </ul>
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                        </Accordion>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label className='mr-2'>Status<span className="text-danger"> *</span></label>
                                                    <label className="right-label-radio mr-3 mb-2 mr-2">
                                                        <div className='d-flex align-items-center'>
                                                            <input name="status" type="radio" checked={themeStatus} value={themeStatus} onChange={(e) => { setThemeStatus(true) }} />
                                                            <span className="checkmark"></span>
                                                            <span className='ml-1' ><i />Active</span>
                                                        </div>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2">
                                                        <div className='d-flex align-items-center'>
                                                            <input name="status" type="radio" checked={!themeStatus} value={!themeStatus} onChange={(e) => { setThemeStatus(false) }} />
                                                            <span className="checkmark"></span>
                                                            <span className='ml-1' ><i />Inactive</span>
                                                        </div>
                                                    </label>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" sm="6">
                                                {
                                                    !viewCheck ?
                                                        <Button className="btn-fill pull-right mt-3" type="submit" variant="info" onClick={submit} >
                                                            {Id ? "Update" : "Add"}
                                                        </Button>
                                                        : ''
                                                }
                                                <Link to={pathname === `/admin/edit-gametheme/${gameThemeId}` ? `/game-theme/${prevGameId}` : '/theme'} className="float-right" >
                                                    <Button className="btn-fill pull-right mt-3" variant="info">
                                                        Back
                                                    </Button>
                                                </Link>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>

                        </Row>

                    </Container>
            }
        </>
    )

}

const mapStateToProps = state => ({
    themes: state.themes,
    createThemeAuth: state.createThemeAuth
})
export default connect(mapStateToProps, { beforeTheme, createTheme, getTheme, updateTheme, gameThemeDetails, updateGameTheme })(AddTheme);