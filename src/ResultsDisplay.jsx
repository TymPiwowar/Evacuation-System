import React from 'react'
import './ResultsDisplay.css'

const ResultsDisplay = ({ results }) => {
	if (!results || Object.keys(results).length === 0) {
		return <div>Podaj liczbę pacjentów i rozpocznij symulację</div>
	}

	const { baselineData, evacSummary, relocSummary, relocLogs } = results

	const RenderSummaryTable = ({ data, title }) => {
		if (!data) return null

		return (
			<div className='tableConatiner'>
				<h2>{title}</h2>
				<table>
					<tbody>
						{Object.entries(data).map(([key, value]) => {
							let displayValue
							if (typeof value === 'object' && value !== null) {
								return null
							} else {
								displayValue = value.toString()
							}
							return (
								<tr key={key}>
									<th>{key}</th>
									<td>{displayValue}</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		)
	}

	const RenderLogs = ({ logs }) => {
		if (!logs || logs.length === 0) return <div>Brak logów</div>

		const headerMap = {
			id: 'ID',
			type: 'Typ Pacjenta',
			specialty: 'Specj. Pierwotna',
			hospital: 'Szpital Docelowy',
			targetSpecialty: 'Oddział Docelowy',
			vehicle: 'Pojazd',
			status: 'Status Relokacji',
			waitTime_s: 'Czas Ocz. (s)',
			waitTime_min: 'Czas Ocz. (min)',
			totalTime_s: 'Czas Całk. (s)',
			totalTime_min: 'Czas Całk. (min)',
			phase: 'Faza',
		}

		const displayedHeaders = Object.keys(logs[0]).filter(key => headerMap[key])

		const getStatusStyle = status => {
			if (status === 'Optimal') return { backgroundColor: '#15492cff', color: 'white', fontWeight: 'bold' }
			if (status.startsWith('Suboptimal')) return { backgroundColor: '#ffae42', color: 'black' }
			if (status === 'Unrelocated') return { backgroundColor: '#dc143c', color: 'white', fontWeight: 'bold' }
			return {}
		}

		return (
			<div className='tableConatiner' style={{ width: '100%' }}>
				<h2>📝 Szczegółowe Logi Relokacji ({logs.length} pozycji)</h2>
				<div style={{ overflowX: 'auto', width: '100%' }}>
					<table style={{ minWidth: '1500px', width: '100%', fontSize: '0.9em' }}>
						<thead>
							<tr>
								{displayedHeaders.map(header => (
									<th key={header} style={{ textAlign: 'left', padding: '10px' }}>
										{headerMap[header]}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{logs.map((log, index) => (
								<tr key={index} style={getStatusStyle(log.status)}>
									{displayedHeaders.map(header => (
										<td key={header} style={{ padding: '10px' }}>
											{/* Wyróżnianie kluczowych kolumn, np. czasów i statusu */}
											{header === 'status' ? <strong>{log[header]}</strong> : log[header]}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		)
	}

	const RenderHospitals = ({ hospitals }) => {
		if (!hospitals || hospitals.length === 0) return null

		const headers = Object.keys(hospitals[0])

		const sumPatients = hospitals => {
			const capacities = Object.values(hospitals.capacity)
			const totalSum = capacities.reduce((sum, current) => sum + current, 0)

			return totalSum
		}

		return (
			<div className='tableConatiner'>
				<h2>Dane o szpitalach</h2>
				<div style={{ overflowX: 'auto' }}>
					<table>
						<thead>
							<tr>
								{headers.map(header => (
									<th key={header}>{header}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{hospitals.map((hospital, index) => (
								<tr key={index}>
									<td>{hospital.name}</td>
									<td>{hospital.distance_km}</td>
									<td>{sumPatients(hospital)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		)
	}

	return (
		<div className='resultsContainer' style={{ gap: '20px' }}>
			<RenderSummaryTable data={baselineData.staff} title={'Personel'} />
			<RenderSummaryTable data={baselineData.equipment} title={'Wyposażenie'} />
			<RenderSummaryTable data={baselineData.objectives} title={'Cele'} />
			<RenderSummaryTable data={baselineData.transport} title={'Transport'} />
			<RenderHospitals hospitals={baselineData.destinationHospitals} />
			<RenderSummaryTable data={evacSummary} title={'podsumowanie ewakuacji'} />
			<RenderSummaryTable data={relocSummary} title={'podsumowanie relokacji'} />
			<RenderLogs logs={relocLogs} title={'logi'} />
		</div>
	)
}

export default ResultsDisplay
