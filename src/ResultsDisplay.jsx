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
									<th style={{ textAlign: 'left' }}>{key}</th>
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

		const headers = Object.keys(logs[0])

		return (
			<div className='tableConatiner'>
				<h2>Szczegółowe Logi Relokacji ({logs.length} pozycji)</h2>
				<div style={{ overflowX: 'auto' }}>
					<table style={{ minWidth: '1000px' }}>
						<thead>
							<tr>
								{headers.map(header => (
									<th key={header}>{header}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{logs.map((log, index) => (
								<tr key={index}>
									{headers.map(header => (
										<td key={header}>{log[header]}</td>
									))}
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
			<RenderSummaryTable data={baselineData} title={'podstawowe dane'} />
			<RenderSummaryTable data={evacSummary} title={'podsumowanie ewakuacji'} />
			<RenderSummaryTable data={relocSummary} title={'podsumowanie relokacji'} />
			<RenderLogs logs={relocLogs} title={'logi'} />
		</div>
	)
}

export default ResultsDisplay
