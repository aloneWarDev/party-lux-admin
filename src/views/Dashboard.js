import { useEffect, useState } from "react";
import { Card, Container, Row, Col,Button,Table, Form, OverlayTrigger, Tooltip, } from "react-bootstrap";
import { beforeDashboard, getDashboard } from './Dashboard.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader'
import { connect } from 'react-redux';
// import Chart from "react-apexcharts"

  
import { Link } from "react-router-dom";
import BarChart from '../components/Chart/chart'

function Dashboard(props) {

	const [data, setData] = useState({
		devUser: 0,
		playerUser: 0,
		stats:null

	})
	// const [currentMonth,setCurrentMonth]=useState('')
	const [loader, setLoader] = useState(true)

	// useEffect(() => {
	// 	props.getDashboard()
	// }, [])

	useEffect(() => {
		setLoader(false)
		if (props.dashboard.dataAuth) {
			const { devUser, playerUser ,stats } = props.dashboard.data
			setData({ devUser, playerUser ,stats})
			// setCurrentMonth(currentMonth)
			// 
			setLoader(false)
			props.beforeDashboard()
		}
	}, [props.dashboard.dataAuth])

	// when an error is received
	useEffect(() => {
		if (props.error.error)
			setLoader(false)
	}, [props.error.error])

	return (
		<div className="pt-3 pt-md-5">
			{
				loader ?
					<FullPageLoader />
					:
					<Container fluid>
						{/* Card Links */}
						<Row>
							<Col xl={3} lg={4} sm={6}>
								<Link to={'/developer-users'}>
									<Card className="card-stats">
										<Card.Body>
											<div className="d-flex justify-content-between">
												<div className="numbers">
													<p className="card-category">Simple Users</p>
													<Card.Title as="h4">{data?.devUser}</Card.Title>
												</div>
												<div className="icon-big text-center icon-warning">
													<i className="nc-icon nc-single-02"></i>
												</div>
											</div>
										</Card.Body>
									</Card>
								</Link>
							</Col>
							<Col xl={3} lg={4} sm={6}>
								<Link to={'/player-users'}>
									<Card className="card-stats">
										<Card.Body>
											<div className="d-flex justify-content-between">
												<div className="numbers">
													<p className="card-category">Business Users</p>
													<Card.Title as="h4">{data?.playerUser}</Card.Title>
												</div>
												<div className="icon-big text-center icon-warning">
													<i className="nc-icon nc-single-02"></i>
												</div>
											</div>
										</Card.Body>
									</Card>
								</Link>
							</Col>
						</Row>
						{/* give it  a try to Chart */}
						<Row>
							<Col xl={6}>
								{/* <Bar options={options} data={data} /> */}
							</Col>
						</Row>
						<Row>
						{ 
							data.stats && data.stats.map( (stat,index)=>{
								return(
									<Col xl={6} key={index} className="dashboard-graphs">
										<Card>
											<Card.Header>
												<Card.Title as='h4'>{stat.heading} Stats</Card.Title>
											</Card.Header>
											<Card.Body>
												<div>
													<BarChart stat={stat}/>
													{/* <Chart 
														series={
															[{
																name: `${stat.heading}`,
																data:  stat.data?.y ? [...stat.data?.y]   : []    // Data is shown in Y-AXIS
															}]
														}
														options={
															{	
																chart: {
																	id: 'apexchart',
																	height: 350,
																	type: 'area'
																},
																colors: ['#FF0000'],
																dataLabels: {
																	enabled: false
																},
																stroke: {
																	curve: 'smooth',
																	width: 1
																},
																xaxis: {
																	categories: stat.data?.x ? stat.data?.x : [] ,  //last 30 days Date is shown in X-AXIS
																	title: {
																		text: 'Number of Days'
																	},
																},
																yaxis: {
																	title: {
																		text: `Number of ${stat.heading}`,
																	},
																	labels: {
																		style: {
																			colors: [],
																			fontSize: '10px',
																			fontFamily: 'sans-serif',
																			fontWeight: '10px',
																			cssClass: 'apexcharts-yaxis-label svg-chart',
																		},
																		formatter: function(val) {
																			return val.toFixed(0);
																		},
																	},
																	crosshairs: {
																		show: true,
																		position: 'back',
																		stroke: {
																			color: '#b6b6b6',
																			width: 0,
																			dashArray: 0,
																		},
																	},	
																},
															}
														}
														type="area"
														// height={350}
													/> */}
												</div>
											</Card.Body>
										</Card>
									</Col>
								);
							})
						}
						</Row>
				</Container>
			}
		</div>
	);
}

const mapStateToProps = state => ({
	dashboard: state.dashboard,
	user: state.user,
	error: state.error,
});

export default connect(mapStateToProps, { beforeDashboard, getDashboard })(Dashboard);
