import { useState, useEffect } from "react";
import { ENV } from '../../config/config';
import { getSettings, beforeSettings, editSettings } from './settings.action';
import { connect } from 'react-redux';
import { getRole } from "views/AdminStaff/permissions/permissions.actions";
import FullPageLoader from "components/FullPageLoader/FullPageLoader";
var CryptoJS = require("crypto-js");
import validator from 'validator';


// react-bootstrap components
import {
	Button,
	Card,
	Form,
	Container,
	Row,
	Col,
} from "react-bootstrap";


const SiteSettings = (props) => {

	const [permissions, setPermissions] = useState({})
	const [loader, setLoader] = useState(true)
	const [msg, setMsg] = useState({
		email: '',
		prizes: '',
		support: '',
		partner: '',
	})

	useEffect(() => {
		window.scroll(0, 0)
		const callback = () => {
			setLoader(false);
		}
		props.getSettings(callback)
		let roleEncrypted = localStorage.getItem('role');
		let role = ''
		if (roleEncrypted) {
			let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
			role = roleDecrypted
		}
		props.getRole(role)
	}, [])

	useEffect(() => {
		if (Object.keys(props.getRoleRes).length > 0) {
			setPermissions(props.getRoleRes.role)
		}
	}, [props.getRoleRes])

	useEffect(() => {
		if (props.settings.settingsAuth) {
			if (props.settings.settings) {
				setLoader(false)
				const settingsData = props.settings.settings
				setSettings({ ...settings, ...settingsData })

			}
			props.beforeSettings()
		}
	}, [props.settings.settingsAuth])

	const [settings, setSettings] = useState({
		email: '',
		// discord:'',
		support: '',
		partner: '',
		address: '',
		desc: '',
		domain: '',
		api: '',

		winngPrizePercentage: 0,
		loosingPrizePercentage: 0,
		adminPercentage: 0,
		developerPercentage: 0,

		loyaltyPercentage: '',
		deksillzCoinWin: '',
		deksillzCoinLoose: '',
	})

	const submit = () => {
		let check = true
		const error = {}


		if (!validator.isEmpty(settings.email.trim()) && !validator.isEmail(settings.email)) {
			error.email = "Invalid Email"
			check = false
		}
		if (!validator.isEmpty(settings.support.trim()) && !validator.isEmail(settings.support)) {
			error.support = "Invalid Support"
			check = false
		}
		if (!validator.isEmpty(settings.partner.trim()) && !validator.isEmail(settings.partner)) {
			error.partner = "Invalid Partner"
			check = false
		}
		if (parseFloat(settings.winngPrizePercentage) + parseFloat(settings.loosingPrizePercentage) + parseFloat(settings.adminPercentage) + parseFloat(settings.developerPercentage) > 100) {
			error.prizes = "The accumulative percentage for winngPrizePercentage + loosingPrizePercentage + adminPercentage + developerPercentage must be greater than or equal to 100  "
			check = false
		}

		setMsg(error)

		if (check) {
			setMsg({
				email: '',
				// discord:'',
				support: '',
				partner: '',
			})


			settings.email = settings.email.toLowerCase().trim()
			settings.support = settings.support.toLowerCase().trim()
			settings.partner = settings.partner.toLowerCase().trim()

			let formData = new FormData()
			for (const key in settings)
				formData.append(key, settings[key])


			const qs = ENV.objectToQueryString({ type: '1' })
			props.editSettings(formData, qs)
			setLoader(true)
		}
	}

	return (
		<>
			{
				loader ? <FullPageLoader /> :
					<Container fluid>
						<Row>
							<Col md="12">
								<Form action="" className="form-horizontal" id="TypeValidation" method="">
									<Card className="table-big-boy">
										<Card.Header>
											<div className="d-block d-md-flex align-items-center justify-content-between">
												<Card.Title as="h4">Site Settings</Card.Title>
											</div>
										</Card.Header>

										<Card.Body>
											<Row>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Site Email</Form.Label>
														<Form.Control type="email" value={settings.email} onChange={(e) => { setSettings({ ...settings, email: e.target.value }) }}></Form.Control>
													</Form.Group>
													<span className={msg.email ? `` : `d-none`}>
														<label className="pl-1 pt-0 text-danger">{msg.email}</label>
													</span>

												</Col>

												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Support Email</Form.Label>
														<Form.Control type="email" value={settings.support} onChange={(e) => { setSettings({ ...settings, support: e.target.value }) }}></Form.Control>
													</Form.Group>
													<span className={msg.support ? `` : `d-none`}>
														<label className="pl-1 pt-0 text-danger">{msg.support}</label>
													</span>

												</Col>

												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Partner Email</Form.Label>
														<Form.Control type="email" value={settings.partner} onChange={(e) => { setSettings({ ...settings, partner: e.target.value }) }}></Form.Control>
													</Form.Group>
													<span className={msg.partner ? `` : `d-none`}>
														<label className="pl-1 pt-0 text-danger">{msg.partner}</label>
													</span>

												</Col>

												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Address</Form.Label>
														<Form.Control type="text" value={settings.address} onChange={(e) => { setSettings({ ...settings, address: e.target.value }) }} ></Form.Control>
													</Form.Group>
												</Col>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Description</Form.Label>
														<Form.Control type="text" value={settings.desc} onChange={(e) => { setSettings({ ...settings, desc: e.target.value }) }} ></Form.Control>
													</Form.Group>
												</Col>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Mailgun Domain</Form.Label>
														<Form.Control type="text" value={settings.domain} onChange={(e) => { setSettings({ ...settings, domain: e.target.value }) }} ></Form.Control>
													</Form.Group>
												</Col>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Mailgun Api-Key</Form.Label>
														<Form.Control type="text" value={settings.api} onChange={(e) => { setSettings({ ...settings, api: e.target.value }) }} ></Form.Control>
													</Form.Group>
												</Col>
											</Row>
										</Card.Body>
										<Card.Header>
											<div className="d-block ">
												<Card.Title as="h4">Deskillz Prize Settings</Card.Title>
												<Form.Label style={{ color: 'red' }}>{msg?.prizes}</Form.Label>
											</div>
										</Card.Header>
										<Card.Body>
											<Row>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Winning Prize Percentage</Form.Label>
														<Form.Control type="number" value={settings.winngPrizePercentage} onChange={(e) => { setSettings({ ...settings, winngPrizePercentage: e.target.value }) }}></Form.Control>
													</Form.Group>
												</Col>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Loosing Prize Percentage</Form.Label>
														<Form.Control type="number" value={settings.loosingPrizePercentage} onChange={(e) => { setSettings({ ...settings, loosingPrizePercentage: e.target.value }) }}></Form.Control>
													</Form.Group>
												</Col>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Admin Percentage</Form.Label>
														<Form.Control type="number" value={settings.adminPercentage} onChange={(e) => { setSettings({ ...settings, adminPercentage: e.target.value }) }}></Form.Control>
													</Form.Group>
												</Col>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Developer Percentage </Form.Label>
														<Form.Control type="number" value={settings.developerPercentage} onChange={(e) => { setSettings({ ...settings, developerPercentage: e.target.value }) }}></Form.Control>
													</Form.Group>
												</Col>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Loyalty Percentage </Form.Label>
														<Form.Control type="number" value={settings.loyaltyPercentage} onChange={(e) => { setSettings({ ...settings, loyaltyPercentage: e.target.value }) }}></Form.Control>
													</Form.Group>
												</Col>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Deksillz Coin Win</Form.Label>
														<Form.Control type="number" value={settings.deksillzCoinWin} onChange={(e) => { setSettings({ ...settings, deksillzCoinWin: e.target.value }) }}></Form.Control>
													</Form.Group>
												</Col>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Deksillz Coin Loose</Form.Label>
														<Form.Control type="number" value={settings.deksillzCoinLoose} onChange={(e) => { setSettings({ ...settings, deksillzCoinLoose: e.target.value }) }}></Form.Control>
													</Form.Group>
												</Col>
											</Row>
										</Card.Body>
										<Card.Header>
											<div className="d-block ">
												<Card.Title as="h4">Socket Settings</Card.Title>
												<Form.Label style={{ color: 'red' }}>{msg?.prizes}</Form.Label>
											</div>
										</Card.Header>
										<Card.Body>
											<Row>
												<Col xl={4} sm={6}>
													<Form.Group>
														<Form.Label className="d-block mb-2">Socket Empty</Form.Label>
														<Form>
															<Form.Check
																type="switch"
																id="socket-switch"
																checked={settings.isSocketEmpty}
																onChange={() => { setSettings({ ...settings, isSocketEmpty: !settings.isSocketEmpty }) }}
															/>
														</Form>
													</Form.Group>
												</Col>
											</Row>
										</Card.Body>

										<Card.Footer>
											<Row className="float-right">
												{
													permissions && permissions.editSetting &&
													<Col sm={12}>
														<Button variant="info" onClick={submit}>Save Settings</Button>
													</Col>
												}
											</Row>
										</Card.Footer>


									</Card>
								</Form>
							</Col>
						</Row>
					</Container>
			}
		</>
	);
}

const mapStateToProps = state => ({
	settings: state.settings,
	error: state.error,
	getRoleRes: state.role.getRoleRes

});

export default connect(mapStateToProps, { getSettings, beforeSettings, editSettings, getRole })(SiteSettings);
