import React from 'react'

const ResultsDisplay = ({ results }) => {
	const { baselineData, evacSummary, relocSummary, relocLogs } = results
	const RenderSummaryTable = ({ data }) => {
		return (
			<div>
				<table>
					{Object.entries(data).map(([key, value]) => {
						return (
							<tr key={key}>
								<th>{value}</th>
							</tr>
						)
					})}
				</table>
			</div>
		)
	}

	return (
		<div>
			<RenderSummaryTable data={baselineData} />
		</div>
	)
}

export default ResultsDisplay
