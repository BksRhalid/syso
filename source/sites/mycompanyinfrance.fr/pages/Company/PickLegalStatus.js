/* @flow */
import { React, T } from 'Components'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { filter } from 'ramda'
import { Link } from 'react-router-dom'
import { possibleStatusSelector } from 'Selectors/companyStatusSelectors'
import { withNamespaces } from 'react-i18next'
import StatusDescription from './StatusDescription'
import type { RouterHistory } from 'react-router'
import { compose } from 'ramda'
import type { LegalStatus } from 'Selectors/companyStatusSelectors'
import withLanguage from 'Components/utils/withLanguage'
import type { TFunction } from 'react-i18next'

import sitePaths from '../../sitePaths'
import { goBackToPreviousQuestion } from 'Actions/companyStatusActions'

type Props = {
	history: RouterHistory,
	possibleStatus: { [LegalStatus]: boolean },
	goBackToPreviousQuestion: () => void,
	setMainStatus: LegalStatus => void,
	language: string,
	t: TFunction
}

const StatusButton = withNamespaces()(
	({ status, t }: { status: LegalStatus, t: TFunction }) => (
		<div style={{textAlign: 'right'}}>

		<Link to={sitePaths().entreprise.créer(status)} className="ui__ button">
			<T>Créer une</T> {t(status)}
		</Link>
		</div>
	)
)
const StatusTitle = ({ status, language }) =>
	status === 'EI' ? (
		<>
			Entreprise individuelle{' '}
			{language !== 'fr' && '(Individual business)'}:{' '}
		</>
	) : status === 'EIRL' ? (
		<>
			Entrepreneur individuel à responsabilité limitée{' '}
			{language !== 'fr' && '(Individual entrepreneur with limited liability)'}:{' '}
		</>
	) : status === 'EURL' ? (
		<>
			EURL - Entreprise unipersonnelle à responsabilité limitée{' '}
			{language !== 'fr' && '(Limited personal company)'}:{' '}
		</>
	) : status === 'SARL' ? (
		<>
			SARL - Société à responsabilité limitée{' '}
			{language !== 'fr' && '(Limited corporation)'}:{' '}
		</>
	) : status === 'SAS' ? (
		<>
			SAS - Société par actions simplifiées{' '}
			{language !== 'fr' && '(Simplified joint stock company)'}:{' '}
		</>
	) : status === 'SASU' ? (
		<>
			SASU - Société par action simplifiée unipersonnelle{' '}
			{language !== 'fr' && '(Simplified personal joint stock company)'}:{' '}
		</>
	) : status === 'SA' ? (
		<>SA - Société anonyme {language !== 'fr' && '(Anonymous company)'}: </>
	) : status === 'SNC' ? (
		<>SNC - Société en nom collectif {language !== 'fr' && '(Partnership)'}: </>
	) : status === 'micro-entreprise' ? (
		<>
			<T>Micro-entreprise</T>
			{language === 'fr' && ' (auto-entrepreneur) '}:{' '}
		</>
	) : status === 'micro-entreprise-EIRL' ? (
		<>
			<T>Micro-entreprise en EIRL</T>{language === 'fr' && ' '}{':'}
		</>
	) : null

const SetMainStatus = ({
	history,
	possibleStatus,
	goBackToPreviousQuestion,
	t,
	language
}: Props) => {
	return (
		<>
			<Helmet>
				<title>
					{t(
						'listeformejuridique.page.titre',
						'Liste des statuts juridiques pour la création de votre entreprise'
					)}
				</title>
			</Helmet>
			<h2>
				<T>Votre forme juridique</T>
			</h2>

			<ul>
				{Object.keys(filter(Boolean, possibleStatus)).map(status => (
					<li key={status}>
						<strong>
							<StatusTitle status={status} language={language} />
						</strong>{' '}
						<StatusDescription status={status} />
						<br />
						<StatusButton status={status} history={history} />
					</li>
				))}
			</ul>
			<div className="ui__ answer-group">
				<button
					onClick={goBackToPreviousQuestion}
					className="ui__ skip-button left">
					‹ <T>Précédent</T>
				</button>
				<Link
					to={sitePaths().sécuritéSociale.index}
					className="ui__ skip-button">
					<T>Choisir plus tard</T> ›
				</Link>
			</div>
		</>
	)
}

export default compose(
	withNamespaces(),
	withLanguage,
	connect(
		state => ({ possibleStatus: possibleStatusSelector(state) }),
		{ goBackToPreviousQuestion }
	)
)(SetMainStatus)
