// EvacuateExtended.js (Zaktualizowany o macierz kompatybilności)
// ----------------------------------------------

// ------------------ DANE PODSTAWOWE ------------------
export const baselineData = () => ({
	map: {
		floors: 2,
		routes: [
			{ from: 'WardA', to: 'Exit1', distance_m: 35, width_m: 1.6, stair: false },
			{ from: 'WardB', to: 'Exit2', distance_m: 50, width_m: 1.2, stair: true, stairMultiplier: 1.5 },
			{ from: 'ICU', to: 'Exit1', distance_m: 40, width_m: 1.4, stair: false },
			{ from: 'WardC', to: 'Exit3', distance_m: 55, width_m: 1.5, stair: false },
			{ from: 'WardD', to: 'Exit1', distance_m: 60, width_m: 1.3, stair: true, stairMultiplier: 1.4 },
		],
	},

	staff: {
		total: 20,
		nurses: 12,
		porters: 8,
		teamsAvailable: 5,
	},

	equipment: {
		stretchers: 5,
		wheelchairs: 8,
		evacuationChairs: 3,
	},

	environment: {
		scenario: 'smoke_scenario',
		Ks_m1: 0.8,
		CO_ppm: 250,
		CO2_percent: 1.0,
		O2_percent: 20.0,
	},

	objectives: {
		targetTime_s: 600,
		minEvacuatedPercent: 95,
		targetRelocationTime_s: 7200,
	},

	// TRANSPORT I CELE
	transport: {
		ambulances_total: 6,
		minibuses_total: 4,
		minibus_capacity: 15, // Max pacjentów w busie
		averageRoadSpeed_kph: 40, // Czas na załadunek/rozładunek (w jedną stronę)
		handlingTime_s: { ambulance: 450, minibus: 600 },
	},

	destinationHospitals: [
		{
			name: 'Szpital im. Barlickiego',
			distance_km: 2,
			capacity: {
				PulmonologiaAlergologia: 5,
				Onkologia: 10,
				Neurologia: 12,
				Neurochirurgia: 4,
				Okulistyka: 6,
				Laryngologia: 2,
				ChirurgiaPlastyczna: 4,
				OIOM: 4,
				Gastroenterologia: 6,
				Nefrologia: 4,
				ChirurgiaOgolna: 12,
				ChorobWewnetrznych: 8,
			},
		},
		{
			name: 'Szpital MSWIA',
			distance_km: 7,
			capacity: {
				ChorobWewnetrznych: 15,
				Kardiologia: 5,
				OrtopediaTraumatologia: 8,
				Onkologia: 4,
				ChirurgiaNaczyniowa: 6,
				OIOM: 2,
				GinekologiaPoloznictwo: 5,
				Urologia: 5,
				Okulistyka: 3,
			},
		},
		{
			name: 'Szpital im. Pirogowa',
			distance_km: 12,
			capacity: {
				Laryngologia: 2,
				ChorobWewnetrznych: 4,
				GinekologiaPoloznictwo: 6,
				Neonatologia: 4,
				ChirurgiaOgolna: 12,
				OIOM: 4,
				Urologia: 6,
			},
		},
	],

	// NOWA MACIERZ KOMPATYBILNOŚCI RELOKACJI
	relocationCompatibility: {
		// Pacjent: [Optymalny Oddział, Suboptymalny 1, Suboptymalny 2, ...]
		Onkologia: ['Onkologia', 'ChorobWewnetrznych', 'ChirurgiaOgolna', 'Urologia'],
		Kardiologia: ['Kardiologia', 'ChorobWewnetrznych', 'PulmonologiaAlergologia'],
		OIOM: ['OIOM'], // OIOM jest priorytetem 1.
		OrtopediaTraumatologia: ['OrtopediaTraumatologia', 'ChirurgiaOgolna', 'Neurochirurgia'],
		PulmonologiaAlergologia: ['PulmonologiaAlergologia', 'ChorobWewnetrznych', 'Kardiologia'],
		Urologia: ['Urologia', 'ChirurgiaOgolna', 'Onkologia'],
		GinekologiaPoloznictwo: ['GinekologiaPoloznictwo', 'ChirurgiaOgolna'],
		Nefrologia: ['Nefrologia', 'ChorobWewnetrznych'],
		Neurologia: ['Neurologia', 'ChorobWewnetrznych'],
		Gastroenterologia: ['Gastroenterologia', 'ChorobWewnetrznych', 'ChirurgiaOgolna'],
		ChirurgiaOgolna: ['ChirurgiaOgolna', 'ChorobWewnetrznych', 'OrtopediaTraumatologia', 'Urologia'],
		Okulistyka: ['Okulistyka', 'ChirurgiaOgolna'],
		Laryngologia: ['Laryngologia', 'ChirurgiaOgolna'],
		ChirurgiaPlastyczna: ['ChirurgiaPlastyczna', 'ChirurgiaOgolna'],
	},
})

// ------------------ GENERATOR PACJENTÓW ------------------
const randomChoice = arr => arr[Math.floor(Math.random() * arr.length)]

export const generatePatients = (count = 150) => {
	const wards = ['WardA', 'WardB', 'WardC', 'WardD', 'ICU']
	const types = ['ambulatory', 'walking', 'bedridden']

	// ZAKTUALIZOWANE SPECJALIZACJE PACJENTA (MUSZĄ PASOWAĆ DO KLUCZY W relocationCompatibility)
	const specialties = [
		'Onkologia',
		'Kardiologia',
		'OIOM',
		'OrtopediaTraumatologia',
		'PulmonologiaAlergologia',
		'Urologia',
		'GinekologiaPoloznictwo',
		'Nefrologia',
		'Neurologia',
		'ChirurgiaOgolna',
	]

	const patients = []
	for (let i = 1; i <= count; i++) {
		const type = randomChoice(types)
		const specialty = randomChoice(specialties)

		let patient = {
			id: `P${i.toString().padStart(3, '0')}`,
			type,
			startLocation: randomChoice(wards),
			priority: Math.ceil(Math.random() * 3),
			baseSpeed: 1.2,
			medicalSpecialty: specialty,
			transportPriority: 'Standard',
		}

		if (type === 'ambulatory') {
			patient.preEvacTime_s = 10 + Math.random() * 10
			patient.baseSpeed = 1.25 + Math.random() * 0.3
		} else if (type === 'walking') {
			patient.preEvacTime_s = 8 + Math.random() * 6
			patient.baseSpeed = 1.1 + Math.random() * 0.25
		} else {
			patient.handlingTime_s = {
				prep: 20 + Math.random() * 20,
				transfer: 50 + Math.random() * 30,
				transport: 80 + Math.random() * 40,
			}
			patient.teamSize = 4
			patient.baseSpeed = 0.55 + Math.random() * 0.1
		}

		// Aktualizacja logiki priorytetów transportu dla nowych G-KSP
		if (patient.type === 'bedridden' || patient.medicalSpecialty === 'OIOM') {
			patient.transportPriority = 'Immediate'
		} else if (
			(patient.medicalSpecialty === 'Kardiologia' || patient.medicalSpecialty === 'Neurologia') &&
			Math.random() < 0.5
		) {
			patient.transportPriority = 'Urgent'
		} else {
			patient.transportPriority = 'Standard'
		}

		patients.push(patient)
	}

	return patients
}

// ------------------ OBLICZANIE CZASU PACJENTA ------------------
const calculateTimeForPatient = (patient, route, environment) => {
	let speed = patient.baseSpeed
	let distance = route.distance_m
	const smokePenalty = 1 - Math.min(environment.Ks_m1 * 0.25, 0.5)
	speed *= smokePenalty
	let travelTime = distance / speed
	if (route.stair === true) {
		travelTime = travelTime * (route.stairMultiplier || 1.0)
	}
	let handlingTime = 0
	if (patient.type === 'bedridden') {
		const ht = patient.handlingTime_s
		handlingTime = ht.prep + ht.transfer + ht.transport
	} else if (patient.preEvacTime_s) {
		handlingTime = patient.preEvacTime_s
	}
	return travelTime + handlingTime
}

// ------------------ FAZA I: SYMULACJA EWAKUACJI BUDYNKU ------------------
export const simulateEvacuation = (scenario, patients) => {
	const { staff, environment } = scenario
	const logs = []
	let evacuationCompletionTime = 0
	let evacuatedCount = 0

	// 1. Podział i sortowanie pacjentów: mobilni (priorytet) i obłożnie chorzy (wymagają zespołu)
	const bedridden = patients.filter(p => p.type === 'bedridden').sort((a, b) => a.priority - b.priority)
	const mobile = patients.filter(p => p.type !== 'bedridden').sort((a, b) => a.priority - b.priority)

	// 2. Obsługa pacjentów MOBILNYCH (ich ewakuacja nie wymaga oczekiwania na personel)
	mobile.forEach(patient => {
		const route = scenario.map.routes.find(r => r.from === patient.startLocation) || scenario.map.routes[0]
		const time = calculateTimeForPatient(patient, route, environment)

		patient.evacuationTime_s = time
		evacuationCompletionTime = Math.max(evacuationCompletionTime, time)
		evacuatedCount++
		logs.push({ id: patient.id, type: patient.type, time_s: time.toFixed(1), route: route.from, phase: 'Evacuation' })
	})

	// 3. Obsługa pacjentów OBŁOŻNIE CHORYCH (wymagają zespołu i sprzętu)
	const teamAvailabilityTimes = Array(staff.teamsAvailable).fill(0)

	bedridden.forEach(patient => {
		const route = scenario.map.routes.find(r => r.from === patient.startLocation) || scenario.map.routes[0]
		const travelTime = calculateTimeForPatient(patient, route, environment)

		// ZNAJDOWANIE WOLNEGO ZESPOŁU: Wybieramy zespół, który jest wolny najwcześniej
		const freeTeamIndex = teamAvailabilityTimes.indexOf(Math.min(...teamAvailabilityTimes))
		const waitTime = teamAvailabilityTimes[freeTeamIndex]

		const totalTime = waitTime + travelTime
		patient.evacuationTime_s = totalTime

		// ZESPÓŁ JEST ZAJĘTY: Aktualizujemy czas dostępności zespołu
		teamAvailabilityTimes[freeTeamIndex] = totalTime + 60

		evacuationCompletionTime = Math.max(evacuationCompletionTime, totalTime)
		evacuatedCount++
		logs.push({
			id: patient.id,
			type: patient.type,
			time_s: totalTime.toFixed(1),
			route: route.from,
			wait_s: waitTime.toFixed(1),
			phase: 'Evacuation',
		})
	})

	const percentEvacuated = (evacuatedCount / patients.length) * 100
	const totalEvacTimeMin = (evacuationCompletionTime / 60).toFixed(1)

	return {
		summary: {
			totalPatients: patients.length,
			evacuated: evacuatedCount,
			percentEvacuated: percentEvacuated.toFixed(1),
			totalEvacuationTime_s: evacuationCompletionTime.toFixed(1),
			totalEvacuationTime_min: totalEvacTimeMin,
			objectivesMet:
				percentEvacuated >= scenario.objectives.minEvacuatedPercent &&
				evacuationCompletionTime <= scenario.objectives.targetTime_s,
		},
		logs,
	}
}

// --- FAZA II: ZARZĄDZANIE RELOKACJĄ I TRANSPORTEM ---

const calculateTransportTime = (distance_km, speed_kph, handlingTime_s, capacity = 1) => {
	const travelTime_s = (distance_km / speed_kph) * 3600
	const handlingTimeTotal_s = handlingTime_s * 2
	return (travelTime_s * 2 + handlingTimeTotal_s) / capacity
}

export const manageRelocation = (patients, scenario, evacuationCompleteTime) => {
	const { transport, destinationHospitals, relocationCompatibility } = scenario
	let relocationLogs = []

	let currentCapacity = JSON.parse(JSON.stringify(destinationHospitals))
	let unrelocatedCount = 0

	// 1. Sortowanie pacjentów według PRIORYTETU TRANSPORTU
	const sortedPatients = patients.sort((a, b) => {
		const prioOrder = { Immediate: 1, Urgent: 2, Standard: 3 }
		return prioOrder[a.transportPriority] - prioOrder[b.transportPriority]
	})

	const immediatePatients = sortedPatients.filter(p => p.transportPriority === 'Immediate')
	const urgentPatients = sortedPatients.filter(p => p.transportPriority === 'Urgent')
	const standardPatients = sortedPatients.filter(p => p.transportPriority === 'Standard')

	// 2. Śledzenie dostępności pojazdów
	const ambulanceAvailability = Array(transport.ambulances_total).fill(evacuationCompleteTime)
	const minibusAvailability = Array(transport.minibuses_total).fill(evacuationCompleteTime)

	let lastRelocationTime = evacuationCompleteTime

	const allPatientsToTransport = [...immediatePatients, ...urgentPatients, ...standardPatients]

	const allocateHospital = (patient, currentCapacity, compatibilityMatrix) => {
		const specialtyPriorities = compatibilityMatrix[patient.medicalSpecialty]

		if (!specialtyPriorities) {
			return { chosenHospital: null, isOptimal: false, targetSpecialty: null }
		}

		// Iterujemy przez listę priorytetów dla danej specjalizacji pacjenta
		for (const targetSpecialty of specialtyPriorities) {
			// Iterujemy przez wszystkie szpitale, aby sprawdzić, czy którykolwiek ma wolne miejsce na oddziale
			for (const hospital of currentCapacity) {
				// Musimy upewnić się, że klucz targetSpecialty istnieje w capacity tego szpitala!
				if (hospital.capacity[targetSpecialty] && hospital.capacity[targetSpecialty] > 0) {
					hospital.capacity[targetSpecialty]--

					// Jeśli znalezione miejsce jest tożsame ze specjalizacją pacjenta, to jest to OPTIMAL (pierwszy priorytet).
					const status = patient.medicalSpecialty === targetSpecialty ? 'Optimal' : 'Suboptimal'

					return { chosenHospital: hospital, isOptimal: status === 'Optimal', targetSpecialty: targetSpecialty }
				}
			}
		}

		// Brak miejsc w ogóle, nawet w suboptymalnych oddziałach
		return { chosenHospital: null, isOptimal: false, targetSpecialty: null }
	}

	let minibusGroup = [] // Grupa pacjentów oczekujących na minibus

	// 3. Pętla transportowa: Przydzielanie pacjentów do pojazdów i obliczanie czasów
	allPatientsToTransport.forEach(patient => {
		// WYWOŁANIE Z PRZEKAZANIEM relocationCompatibility
		const { chosenHospital, isOptimal, targetSpecialty } = allocateHospital(
			patient,
			currentCapacity,
			relocationCompatibility
		)

		if (!chosenHospital) {
			unrelocatedCount++
			relocationLogs.push({
				id: patient.id,
				hospital: 'BRAK MIEJSCA',
				status: 'Unrelocated',
				phase: 'Relocation',
			})
			return
		}

		let vehicleType
		let vehicleArray
		let handlingTime

		// WYBÓR POJAZDU (Karetka vs. Minibus)
		if (patient.transportPriority === 'Immediate' || patient.transportPriority === 'Urgent') {
			vehicleType = 'ambulance'
			vehicleArray = ambulanceAvailability
			handlingTime = transport.handlingTime_s.ambulance
		} else {
			// Pacjent 'Standard' jest dodawany do grupy minibusowej
			minibusGroup.push(patient)

			// Jeśli minibus jest niepełny, czekamy na więcej pacjentów, kontynuujemy pętlę.
			// Wyjątek: jeśli to ostatni pacjent na liście.
			if (
				minibusGroup.length < transport.minibus_capacity &&
				allPatientsToTransport.indexOf(patient) < allPatientsToTransport.length - 1
			) {
				return
			}

			// Jeśli minibus jest pełny LUB to ostatnia grupa, kontynuujemy proces alokacji busa
			patient = minibusGroup[minibusGroup.length - 1] // Używamy danych ostatniego pacjenta do logowania grupy
			vehicleType = 'minibus'
			vehicleArray = minibusAvailability
			handlingTime = transport.handlingTime_s.minibus
		}

		// ZNAJDOWANIE WOLNEGO POJAZDU
		const vehicleIndex = vehicleArray.indexOf(Math.min(...vehicleArray))
		const departureTime = vehicleArray[vehicleIndex]

		const waitTime = Math.max(0, departureTime - patient.evacuationTime_s)

		// OBLICZANIE CZASU CYKLU
		const capacityFactor = vehicleType === 'minibus' ? minibusGroup.length : 1
		const cycleTime =
			calculateTransportTime(chosenHospital.distance_km, transport.averageRoadSpeed_kph, handlingTime, capacityFactor) *
			capacityFactor

		// AKTUALIZACJA DOSTĘPNOŚCI POJAZDU
		vehicleArray[vehicleIndex] = departureTime + cycleTime

		const singlePatientRelocationTime = cycleTime / capacityFactor
		const totalRelocationTime_s = patient.evacuationTime_s + waitTime + singlePatientRelocationTime
		lastRelocationTime = Math.max(lastRelocationTime, totalRelocationTime_s)

		// 4. LOGOWANIE WYNIKÓW (różne dla karetki i minibusu)
		const logEntry = {
			id: patient.id,
			type: patient.type,
			specialty: patient.medicalSpecialty,
			hospital: chosenHospital.name,
			targetSpecialty: targetSpecialty, // DODANE
			vehicle: vehicleType,
			status: isOptimal ? 'Optimal' : 'Suboptimal',
			waitTime_s: waitTime.toFixed(1),
			waitTime_min: (waitTime / 60).toFixed(1),
			totalTime_s: totalRelocationTime_s.toFixed(1),
			totalTime_min: (totalRelocationTime_s / 60).toFixed(1),
			phase: 'Relocation',
		}

		if (vehicleType === 'minibus') {
			// Logowanie każdego pacjenta z grupy minibusowej (mają ten sam czas relokacji)
			minibusGroup.forEach(p => {
				const pTotalTime_s = parseFloat(p.evacuationTime_s) + waitTime + singlePatientRelocationTime
				relocationLogs.push({
					...logEntry,
					id: p.id,
					specialty: p.medicalSpecialty,
					totalTime_s: pTotalTime_s.toFixed(1),
					totalTime_min: (pTotalTime_s / 60).toFixed(1),
				})
			})
			minibusGroup = [] // bus odjechał, grupa jest pusta
		} else {
			relocationLogs.push(logEntry) // Logowanie pojedynczego pacjenta (karetka)
		}
	})

	// 5. Obsługa OSTATNIEJ, niepełnej grupy minibusowej, jeśli jakaś pozostała
	if (minibusGroup.length > 0) {
		const patient = minibusGroup[minibusGroup.length - 1]

		// POPRAWIONE WYWOŁANIE FUNKCJI allocateHospital (przekazanie 3 argumentów)
		const { chosenHospital, isOptimal, targetSpecialty } = allocateHospital(
			patient,
			currentCapacity,
			relocationCompatibility // DODANE
		)

		// Jeśli mimo to nie znaleziono miejsca (np. pacjent z Ginekologii, a wszystkie miejsca Ginekologia/ChirurgiaOgolna zajęte)
		if (!chosenHospital) {
			unrelocatedCount += minibusGroup.length
			minibusGroup.forEach(p =>
				relocationLogs.push({
					id: p.id,
					hospital: 'BRAK MIEJSCA',
					status: 'Unrelocated',
					phase: 'Relocation',
				})
			)
			minibusGroup = []
			// Kontynuujemy do podsumowania
		} else {
			// Kontynuacja normalnej logiki transportowej dla ostatniej grupy
			const vehicleType = 'minibus'
			const vehicleArray = minibusAvailability
			const handlingTime = transport.handlingTime_s.minibus

			const vehicleIndex = vehicleArray.indexOf(Math.min(...vehicleArray))
			const departureTime = vehicleArray[vehicleIndex]
			const waitTime = Math.max(0, departureTime - patient.evacuationTime_s)

			const capacityFactor = minibusGroup.length
			const cycleTime =
				calculateTransportTime(
					chosenHospital.distance_km,
					transport.averageRoadSpeed_kph,
					handlingTime,
					capacityFactor
				) * capacityFactor

			const singlePatientRelocationTime = cycleTime / capacityFactor

			vehicleArray[vehicleIndex] = departureTime + cycleTime

			const totalRelocationTime_s = patient.evacuationTime_s + waitTime + singlePatientRelocationTime
			lastRelocationTime = Math.max(lastRelocationTime, totalRelocationTime_s)

			const logEntry = {
				id: patient.id,
				type: patient.type,
				specialty: patient.medicalSpecialty,
				hospital: chosenHospital.name,
				targetSpecialty: targetSpecialty, // DODANE
				vehicle: vehicleType,
				status: isOptimal ? 'Optimal' : 'Suboptimal (Awaryjny)',
				waitTime_s: waitTime.toFixed(1),
				waitTime_min: (waitTime / 60).toFixed(1),
				totalTime_s: totalRelocationTime_s.toFixed(1),
				totalTime_min: (totalRelocationTime_s / 60).toFixed(1),
				phase: 'Relocation',
			}

			minibusGroup.forEach(p => {
				const pTotalTime_s = parseFloat(p.evacuationTime_s) + waitTime + singlePatientRelocationTime
				relocationLogs.push({
					...logEntry,
					id: p.id,
					specialty: p.medicalSpecialty,
					totalTime_s: pTotalTime_s.toFixed(1),
					totalTime_min: (pTotalTime_s / 60).toFixed(1),
				})
			})
		}
	}

	const relocatedCount = relocationLogs.filter(l => l.status !== 'Unrelocated').length
	const unrelocatedFinalCount = relocationLogs.filter(l => l.status === 'Unrelocated').length
	const lastRelocationTimeMin = (lastRelocationTime / 60).toFixed(1)

	return {
		relocationSummary: {
			totalRelocated: relocatedCount,
			totalRelocationTime_s: lastRelocationTime.toFixed(1),
			totalRelocationTime_min: lastRelocationTimeMin,
			unrelocatedDueToCapacity: unrelocatedFinalCount,
			optimalRelocated: relocationLogs.filter(l => l.status === 'Optimal').length,
			suboptimalRelocated: relocationLogs.filter(l => l.status.startsWith('Suboptimal')).length,
			relocationObjectivesMet: lastRelocationTime <= scenario.objectives.targetRelocationTime_s,
		},
		relocationLogs,
	}
}

// --- WYKONANIE SYMULACJI ---
export const runSimulation = (patientCount = 150) => {
	const data = baselineData()
	const patients = generatePatients(patientCount)

	// FAZA I: Ewakuacja budynku
	const evacResult = simulateEvacuation(data, patients)

	// FAZA II: Relokacja
	const relocationResult = manageRelocation(patients, data, parseFloat(evacResult.summary.totalEvacuationTime_s))

	// Łączenie wszystkich danych w jeden obiekt do wyświetlenia
	return {
		baselineData: data,
		patientData: patients,
		evacSummary: evacResult.summary,
		relocSummary: relocationResult.relocationSummary,
		relocLogs: relocationResult.relocationLogs,
	}
}
