import React, { Component } from 'react'
import 'whatwg-fetch'
import { connect } from 'react-redux'
import './Satisfaction.css'
import { Trans, translate } from 'react-i18next'
import ReactPiwik from './Tracker'
import PropTypes from 'prop-types'

@connect(state => ({
	sessionId: state.sessionId,
	textColourOnWhite: state.themeColours.textColourOnWhite
}))
@translate()
export default class Satisfaction extends Component {
	static contextTypes = {
		i18n: PropTypes.object.isRequired
	}
	state = {
		answer: false,
		message: null,
		address: null,
		messageSent: false
	}
	sendSatisfaction(answer) {
		let { message, address } = this.state
		if (document.location.hostname != 'localhost') {
			fetch('https://embauche.beta.gouv.fr/retour-syso', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					fields: {
						satisfait: answer || '',
						message:
							(message || '') + (address ? '(envoyé par ' + address + ')' : ''),
						date: new Date().toISOString(),
						id: this.props.sessionId,
						url: document.location.href.toString()
					}
				})
			}).then(response => {
				console.log(response)
				if (!response.ok)
					return console.log('Erreur dans la récolte de la satisfaction') //eslint-disable-line no-console
				if (message) return this.setState({ messageSent: true })
				this.setState({ answer })
			})
		} else {
			console.log('!!!!!!!! Les retours ne sont pas envoyés en localhost !')
			if (message) this.setState({ messageSent: true })
			this.setState({ answer })
		}
	}
	render() {
		let { answer, message, address, messageSent } = this.state,
			{ i18n } = this.context,
			validMessage =
				(typeof message == 'string' && message.length > 4) ||
				(typeof address == 'string' && address.length > 4),
			onSmileyClick = s => {
				// Pour l'instant on double le flux avec Piwik
				ReactPiwik.push(['trackEvent', 'feedback', 'smiley', s])
				this.sendSatisfaction(s)
			}

		if (!answer)
			return (
				<div id="satisfaction">
					<p>
						<Trans i18nKey="satisfaction">
							Vous êtes satisfait du simulateur ?
						</Trans>
					</p>
					<p>
						<Smiley
							text=":)"
							hoverColor="#16a085"
							themeColour={this.props.textColourOnWhite}
							clicked={onSmileyClick}
						/>
						<Smiley
							text=":|"
							hoverColor="#f39c12"
							themeColour={this.props.textColourOnWhite}
							clicked={onSmileyClick}
						/>
					</p>
				</div>
			)

		let messagePlaceholder = {
			':)': i18n.t('Envoyez-nous un commentaire !'),
			':|': i18n.t("Qu'est-ce qui n'a pas été ?")
		}[answer]

		let feedback = (
			<div>
				<input
					type="text"
					value={this.state.address || ''}
					onChange={e => this.setState({ address: e.target.value })}
					placeholder="adresse@courriel.com (optionnel)"
				/>
				<textarea
					value={this.state.message || ''}
					onChange={e => this.setState({ message: e.target.value })}
					placeholder={messagePlaceholder}
				/>
			</div>
		)

		return (
			<div id="satisfaction">
				{!messageSent && feedback}
				<button
					id="sendMessage"
					style={{ color: this.props.textColourOnWhite }}
					disabled={!validMessage || messageSent}
					onClick={() => this.sendSatisfaction()}>
					{messageSent ? (
						<i
							id="messageSent"
							className="fa fa-check"
							aria-hidden="true"
							style={{ color: this.props.textColourOnWhite }}
						/>
					) : (
						<span>
							<i className="fa fa-paper-plane" aria-hidden="true" />
							<span className="text">
								<Trans>envoyer</Trans>
							</span>
						</span>
					)}
				</button>
				<p>
					<Trans i18nKey="satisfaction-email-ou">
						Pour recevoir une réponse, laissez-nous votre adresse ou{' '}
					</Trans>
					<a
						href={
							'mailto:contact@embauche.beta.gouv.fr?subject=Suggestion pour le simulateur ' +
							this.props.simu
						}>
						<Trans i18nKey="satisfaction-mailto">
							{' '}
							envoyez-nous directement un mail{' '}
						</Trans>
						<i
							className="fa fa-envelope-open-o"
							aria-hidden="true"
							style={{ margin: '0 .3em' }}
						/>
					</a>
				</p>
			</div>
		)
	}
}
