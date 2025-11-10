import React from 'react'
import './ResultsDisplay.css'

const ResultsDisplay = ({ results }) => {
	if (!results || Object.keys(results).length === 0) {
		return <div>Podaj liczbę pacjentów i rozpocznij symulację</div>
	}

	const { baselineData, evacSummary, relocSummary, relocLogs } = results
	const RenderSummaryTable = ({ data }) => {
		if (!data) return null

		return (
			<div className='tableConatiner'>
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
									<th style={{ color: 'red', textAlign: 'center' }}>{key}</th>
									<td>{displayValue}</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		)
	}

	return (
		<div>
			<RenderSummaryTable data={baselineData} />
			<RenderSummaryTable data={evacSummary} />
			<RenderSummaryTable data={relocSummary} />
			<RenderSummaryTable data={relocLogs} />
		</div>
	)
}

export default ResultsDisplay
