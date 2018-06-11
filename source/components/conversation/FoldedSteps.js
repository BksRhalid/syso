// css in conversation.Css
import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { animateScroll, Element, scroller } from 'react-scroll'
import { reset } from 'redux-form'
import { resetSimulation } from '../../actions'
import { LinkButton, SimpleButton } from '../ui/Button'
import { isEmpty } from 'ramda'

import { flatRulesSelector } from 'Selectors/analyseSelectors'
import FoldedStep from './FoldedStep'

@connect(
	state => ({
		foldedSteps: state.conversationSteps.foldedSteps,
		targetNames: state.targetNames,
		flatRules: flatRulesSelector(state)
	}),
	{
		resetSimulation,
		resetForm: () => reset('conversation')
	}
)
@translate()
export default class FoldedSteps extends Component {
	handleSimulationReset = () => {
		this.props.resetSimulation()
		this.props.resetForm()
	}
	render() {
		let { foldedSteps } = this.props

		if (isEmpty(foldedSteps || [])) return null
		return (
			<div id="foldedSteps">
				<div className="header">
					<LinkButton onClick={this.handleSimulationReset}>
						<i className="fa fa-trash" aria-hidden="true" />
						<Trans i18nKey="resetAll">Tout effacer</Trans>
					</LinkButton>
				</div>
				{foldedSteps.map(dottedName => (
					<FoldedStep key={dottedName} dottedName={dottedName} />
				))}
			</div>
		)
	}
}

@connect(state => ({
	foldedSteps: state.foldedSteps,
	conversationStarted: state.conversationStarted
}))
export class GoToAnswers extends Component {
	componentDidUpdate(prevProps) {
		if (!prevProps.conversationStarted && this.props.conversationStarted) {
			scroller.scrollTo('myScrollToElement', {
				duration: 200,
				delay: 0,
				smooth: true
			})
			return
		}
		if (prevProps.foldedSteps.length === this.props.foldedSteps.length) return

		scroller.scrollTo('myScrollToElement', {
			duration: 0,
			delay: 0,
			smooth: false
		})
	}
	handleScrollToAnswers = () => {
		animateScroll.scrollToTop({
			duration: 200,
			delay: 0,
			smooth: true
		})
	}
	render() {
		return (
			<Element name="myScrollToElement" id="myScrollToElement">
				<SimpleButton
					onClick={this.handleScrollToAnswers}
					className="scrollIndication up"
					style={{
						visibility: !this.props.foldedSteps.length ? 'hidden' : 'visible'
					}}>
					<i className="fa fa-long-arrow-up" aria-hidden="true" />
					&nbsp;<Trans i18nKey="change">Modifier mes réponses</Trans>
				</SimpleButton>
			</Element>
		)
	}
}
