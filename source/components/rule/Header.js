import withColours from 'Components/utils/withColours'
import { createMarkdownDiv } from 'Engine/marked'
import { path } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { capitalise0 } from '../../utils'
import Destinataire from './Destinataire'
import './Header.css'
import Namespace from './Namespace'
import PeriodSwitch from 'Components/PeriodSwitch'

let RuleHeader = withColours(
	({
		ns,
		type,
		description,
		question,
		flatRule,
		flatRules,
		name,
		title,
		icon,
		colours,
		valuesToShow
	}) => (
		<section id="ruleHeader">
			<header style={{ background: colours.colour }}>
				<div id="ruleHeader__main">
					{ns && (
						<Namespace {...{ ns, flatRules, colour: colours.textColour }} />
					)}
					<h1 style={{ color: colours.textColour }}>
						{title || capitalise0(name)}
					</h1>
				</div>
				{icon && <span id="ruleHeader__icon"> {emoji(icon)}</span>}
			</header>
			<div id="ruleHeader__content">
				<div id="ruleHeader__description">
					{createMarkdownDiv(description || question)}
				</div>
				<div id="ruleHeader__infobox">
					{type && (
						<div className="infobox__item">
							<h4>Type&nbsp;:</h4>
							<Trans>{capitalise0(type)}</Trans>
						</div>
					)}
					{do {
						let period = flatRule['période']
						period && (
							<div className="infobox__item">
								<h4>Période :</h4>
								{valuesToShow && period === 'flexible' ? (
									<PeriodSwitch />
								) : (
									<div className="inlineMecanism">
										<span
											className="name"
											data-term-definition="période"
											style={{ background: '#8e44ad' }}>
											{period}
										</span>
									</div>
								)}
							</div>
						)
					}}
					<Destinataire destinataire={path([type, 'destinataire'])(flatRule)} />
				</div>
			</div>
		</section>
	)
)
export default RuleHeader
