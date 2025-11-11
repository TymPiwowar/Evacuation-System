import { useEffect, useId, useState } from 'react'
import './App.css'
import { runSimulation } from './EvacuateExtended'
import ResultsDisplay from './ResultsDisplay'

function App() {
	const [patientsNumber, setPatientsNumber] = useState('')
	const [simulationResults, setSimulationResults] = useState('')
	const id = useId()

	const handleSimulation = patientsNumber => {
		const number = parseInt(patientsNumber, 10)
		const res = runSimulation(number)
		setSimulationResults(res)
	}

	return (
		<div className='mainContainer'>
			<h1>Evacuation Simulation</h1>
			<div className='textContainer'>
				<label htmlFor={id}>Please specify number of patients:</label>
				<input
					id={id}
					value={patientsNumber}
					placeholder='input number'
					onInput={e => setPatientsNumber(e.target.value)}
				/>
				<button onClick={() => handleSimulation(patientsNumber)} className='startSimulationButton'>
					Start
				</button>
			</div>

			<ResultsDisplay results={simulationResults} />
		</div>
	)
}

export default App
