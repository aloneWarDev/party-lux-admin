import react, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getGames, beforeGame, getGame, getUser, editGame, getAllUser } from './Games.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, FormGroup, Accordion, AccordionCollapse } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router';
import ThemeAccordion from 'views/Themes/ThemeAccordion';


const GameTheme = (props) => {
    let { gameId } = useParams()
    // Loader
    const [loader, setLoader] = useState(true)
    //Accordian
    const [isActiveOne, setIsActiveOne] = useState("")
    const [isActiveTwo, setIsActiveTwo] = useState("")
    const [isActiveThree, setIsActiveThree] = useState("")
    const [isActiveFour, setIsActiveFour] = useState("")
    const [isActiveFive, setIsActiveFive] = useState("")
    const [isActiveSix, setIsActiveSix] = useState("")
    //accordian-handle
    const [accordianSwitch, setAccordianSwitch] = useState("")
    //theme
    const [themeStatus, setThemeStatus] = useState(true)
    const [themeName, setThemeName] = useState("")
    //themes
    const [themes, setThemes] = useState([])
    //coreColor
    const [coreColor, setCoreColor] = useState({
        backgroundGradient: {
            type: "gradient",
            value: [{ color: "" }, { color: "" }, { color: "" }]
        },
        mainColor: { type: "color", value: "" },
        mainColorOpacity: { type: "input", value: "", regex: /^(0+\.?|0*\.\d+|0*1(\.0*)?)$/ },
        mainDividerColor: { type: "color", value: "" },
        secondaryColor: { type: "color", value: "" },
        secondaryColorOpacity: { type: "input", value: "", regex: /^(0+\.?|0*\.\d+|0*1(\.0*)?)$/ },
        secondaryDividerColor: { type: "color", value: "" },
        tertiaryColor: { type: "color", value: "" },
        tertiaryColorOpacity: { type: "input", value: "", regex: /^(0+\.?|0*\.\d+|0*1(\.0*)?)$/ },
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
    //accentColor
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
    //
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
    //
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
    //
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
    //
    const [advanced, setAdvanced] = useState({
        cellAlternateBackgroundColor: { type: "color", value: "" },
        OpacityNone: { type: "input", value: "", regex: /^(0+\.?|0*\.\d+|0*1(\.0*)?)$/ },
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
        sidePanelBlurStyle: { type: "input", value: "", regex: /^[0-1]$/ },
        statusBarContentStyle: { type: "input", value: "", regex: /^[0-1]$/ },
        viewCornerRadiusPrimary: { type: "input", value: "", regex: /^[1-9][0-9]?$|^100$/ },
        viewCornerRadiusSecondary: { type: "input", value: "", regex: /^[1-9][0-9]?$|^100$/ },
        viewCornerRadiusTertiary: { type: "input", value: "", regex: /^[1-9][0-9]?$|^100$/ },
        viewBorderWidthPrimary: { type: "input", value: "", regex: /^[1-9][0-9]?$|^100$/ },
        viewBorderWidthSecondary: { type: "input", value: "", regex: /^[1-9][0-9]?$|^100$/ },
        viewBorderWidthTertiary: { type: "input", value: "", regex: /^[1-9][0-9]?$|^100$/ },
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
    //error
    const [error, setError] = useState({})
    //empty dependency
    useEffect(() => {
        window.scroll(0, 0)
        setLoader(false)
    }, [])
    //gameId
    useEffect(() => {
        if (gameId) {
            // props.listGameTheme(gameId)
        }
    }, [gameId])
    //props.game.getThemesAuth
    useEffect(() => {
        if (props.game.getThemesAuth) {
            
            // const { name, coreColor, accentColor, buttons, text, artwork, advanced, status } = props.game.themes
            setThemes(props.game.themes)


        }
    }, [props.game.getThemesAuth])
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
        setAccentColor({ ...data, [name]: { type: "color", value: value } })
    }
    //
    const onChangeTextColors = (e) => {
        let { name, value } = e.target
        let data = textColors
        // data[`${name}`] = value
        setTextColors({ ...data, [name]: { type: "color", value: value } })
    }
    //
    const onChangeButtonColors = (e) => {
        let { name, value } = e.target
        let data = buttonColors
        // data[`${name}`] = value
        setButtonColor({ ...data, [name]: { type: "color", value: value } })
    }
    //
    const onChangeArtworkColors = (e) => {
        let { name, value } = e.target
        let data = artwork
        // data[`${name}`] = value
        setArtWork({ ...data, [name]: { type: "color", value: value } })
    }
    //
    const onChangeAdvancedColors = (e) => {
        let { name, value } = e.target
        let data = advanced
        // data[`${name}`] = value
        setAdvanced({ ...data, [name]: { type: "color", value: value } })
    }

    const handleAccordian = (item = {}, index = "") => {
        if (item && index) {
            setCoreColor(JSON.parse(item.coreColor))
            setAccentColor(JSON.parse(item.accentColor))
            setButtonColor(JSON.parse(item.buttons))
            setTextColors(JSON.parse(item.text))
            setArtWork(JSON.parse(item.artwork))
            setAdvanced(JSON.parse(item.advanced))
            setThemeName(item.name)
            setThemeStatus(item.status)
            setAccordianSwitch(index)
        } else {
            for (let i = 0; i < themes.length; i++) {
                if (i === parseInt(index) - 1) {
                    setThemes([...themes,])
                }
                
            }
            setCoreColor("")
            setAccentColor("")
            setButtonColor("")
            setTextColors("")
            setArtWork("")
            setAdvanced("")
            setThemeName("")
            setThemeStatus("")
            setAccordianSwitch("")
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
                            <Col md='12'>
                                <Card className="pb-3 table-big-boy" >
                                    <Card.Header>
                                        <Card.Title as="h4" >Game Theme</Card.Title>
                                    </Card.Header>
                                    <Card.Body>

                                        {/* {
                                                themes && themes.map((item , index)=>{
                                                    return(
                                                        <>
                                                            <Accordion activeKey={accordianSwitch}>
                                                                <Card>
                                                                    <Accordion.Toggle className="accordion-toggle" as={Card.Header} eventKey={`${index+""}`} onClick={() => { accordianSwitch === index+"" ? handleAccordian({} , "") : handleAccordian(item , index+"") }}>
                                                                        {item.name}
                                                                    </Accordion.Toggle>
                                                                    <Accordion.Collapse eventKey={`${index+""}`} >
                                                                        <Card.Body >
                                                                            <ul className="text-white">
                                                                                <Accordion activeKey={isActiveOne}>
                                                                                    <Card>
                                                                                        <Accordion.Toggle className="accordion-toggle" as={Card.Header} eventKey={index+'1'} onClick={() => { isActiveOne === index+"1" ? setIsActiveOne("") : setIsActiveOne(index+"1") }}>
                                                                                            Core Colors
                                                                                        </Accordion.Toggle>
                                                                                        <Accordion.Collapse eventKey={index+'1'}>
                                                                                            <Card.Body>
                                                                                                <ul className="text-white">    
                                                                                                    {
                                                                                                    <ThemeAccordion BigState={coreColor} setItem={setCoreColor} InputChange={onChangeCoreColor} notes={coreColorMsg} err={error?.coreColor} />
                                                                                                </ul>
                                                                                            </Card.Body>
                                                                                        </Accordion.Collapse>
                                                                                    </Card>
                                                                                </Accordion>
                                                                                <Accordion activeKey={isActiveTwo}>
                                                                                    <Card>
                                                                                        <Accordion.Toggle className="accordion-toggle" as={Card.Header} eventKey={index+'2'} onClick={() => { isActiveTwo === index+"2" ? setIsActiveTwo("") : setIsActiveTwo(index+"2") }}>
                                                                                            Accent Colors 
                                                                                        </Accordion.Toggle>
                                                                                        <Accordion.Collapse eventKey={index+'2'}>
                                                                                            <Card.Body>
                                                                                                <ul className="text-white">
                                                                                                    <ThemeAccordion BigState={accentColor} setItem={setAccentColor} InputChange={onChangeAccentColor} notes={accentColorMsg} err={error?.accentColor} />
                                                                                                </ul>
                                                                                            </Card.Body>
                                                                                        </Accordion.Collapse>
                                                                                    </Card>
                                                                                </Accordion>
                                                                                <Accordion activeKey={isActiveThree}>
                                                                                    <Card>
                                                                                        <Accordion.Toggle className="accordion-toggle" as={Card.Header} eventKey={index+'3'} onClick={() => { isActiveThree === index+"3" ? setIsActiveThree("") : setIsActiveThree(index+"3") }}>
                                                                                            Buttons
                                                                                        </Accordion.Toggle>
                                                                                        <Accordion.Collapse eventKey={index+'3'}>
                                                                                            <Card.Body>
                                                                                                <ul className="text-white">
                                                                                                    <ThemeAccordion BigState={buttonColors} setItem={setButtonColor} InputChange={onChangeButtonColors} notes={buttonColorsMsg} err={error?.buttonColors} />
                                                                                                </ul>
                                                                                            </Card.Body>
                                                                                        </Accordion.Collapse>
                                                                                    </Card>
                                                                                </Accordion>
                                                                                <Accordion activeKey={isActiveFour}>
                                                                                    <Card>
                                                                                        <Accordion.Toggle className="accordion-toggle" as={Card.Header} eventKey={index+'4'} onClick={() => { isActiveFour === index+"4" ? setIsActiveFour("") : setIsActiveFour(index+"4") }}>
                                                                                            Text
                                                                                        </Accordion.Toggle>
                                                                                        <Accordion.Collapse eventKey={index+'4'}>
                                                                                            <Card.Body>
                                                                                                <ul className="text-white">
                                                                                                    <ThemeAccordion BigState={textColors} setItem={setTextColors} InputChange={onChangeTextColors} notes={textColorsMsg} err={error?.textColors} />
                                                                                                </ul>
                                                                                            </Card.Body>
                                                                                        </Accordion.Collapse>
                                                                                    </Card>
                                                                                </Accordion>
                                                                                <Accordion activeKey={isActiveFive}>
                                                                                    <Card>
                                                                                        <Accordion.Toggle className="accordion-toggle" as={Card.Header} eventKey={index + '5'} onClick={() => { isActiveFive === index + "5" ? setIsActiveFive("") : setIsActiveFive(index + "5") }}>
                                                                                            Artwork 
                                                                                        </Accordion.Toggle>
                                                                                        <Accordion.Collapse eventKey={index + '5'}>
                                                                                            <Card.Body>
                                                                                                <ul className="text-white">
                                                                                                    <ThemeAccordion BigState={artwork} setItem={setArtWork} InputChange={onChangeArtworkColors} notes={artworkMsg} err={error?.artwork} />
                                                                                                </ul>
                                                                                            </Card.Body>
                                                                                        </Accordion.Collapse>
                                                                                    </Card>
                                                                                </Accordion>
                                                                                <Accordion activeKey={isActiveSix}>
                                                                                    <Card>
                                                                                        <Accordion.Toggle className="accordion-toggle" as={Card.Header} eventKey={index + '6'} onClick={() => { isActiveSix === index + "6" ? setIsActiveSix("") : setIsActiveSix(index+"6") }}>
                                                                                            Advanced
                                                                                        </Accordion.Toggle>
                                                                                        <Accordion.Collapse eventKey={index +'6'}>
                                                                                            <Card.Body>
                                                                                                <ul className="text-white">
                                                                                                    <ThemeAccordion  BigState={advanced} setItem={setAdvanced} InputChange={onChangeAdvancedColors} notes={advancedMsg} err={error?.advanced} />
                                                                                                </ul>
                                                                                            </Card.Body>
                                                                                        </Accordion.Collapse>
                                                                                    </Card>
                                                                                </Accordion>
                                                                            </ul>
                                                                        </Card.Body>
                                                                    </Accordion.Collapse>
                                                                </Card>
                                                            </Accordion>
                                                        </>
                                                    )
                                                })
                                            } */}
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
    game: state.game,
    error: state.error,
})
export default connect(mapStateToProps, {})(GameTheme);