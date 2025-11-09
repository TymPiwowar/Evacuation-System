import { useEffect, useId, useState } from 'react'
import './App.css'
import { runSimulation } from './EvacuateExtended'
import ResultsDisplay from './ResultsDisplay'

function App() {
	const [patientsNumber, setPatientsNumber] = useState(0)
	const [simulationResults, setSimulationResults] = useState('')
	const id = useId()

	const handleSimulation = patientsNumber => {
		const number = parseInt(patientsNumber, 10)
		const res = runSimulation(number)
		setSimulationResults(res)
	}

	return (
		<>
			<div>
				<label htmlFor={id}>Please specify:</label>
				<input id={id} value={patientsNumber} onInput={e => setPatientsNumber(e.target.value)} />
				<button onClick={() => handleSimulation(patientsNumber)} className='startSimulationButton'>
					Start simulation
				</button>
				<ResultsDisplay results={simulationResults} />
			</div>
		</>
	)
}

export default App
