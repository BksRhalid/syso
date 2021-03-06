import React, { Suspense } from 'react'
import { connect } from 'react-redux'
import Home from './Home'

let LazyColorPicker = React.lazy(() => import('./ColorPicker'))

export default connect(
	state => ({ couleur: state.themeColours.colour }),
	dispatch => ({
		changeColour: colour => dispatch({ type: 'CHANGE_THEME_COLOUR', colour })
	})
)(
	class Couleur extends React.Component {
		changeColour = ({ hex }) => this.props.changeColour(hex)
		render() {
			return (
				<div className="ui__ container">
					<p className="indication">
						Visualisez sur cette page l’apparence du module pour différentes
						couleurs principales.
					</p>
					<Suspense fallback={<div>Chargement...</div>}>
						<LazyColorPicker
							color={this.props.couleur}
							onChangeComplete={this.changeColour}
						/>
					</Suspense>
					<p className="indication">
						La couleur sélectionnée, à déclarer comme attribut
						&quot;data-couleur&quot; du script sur votre page est :{' '}
						<b>{this.props.couleur}</b>
					</p>
					<Home />
				</div>
			)
		}
	}
)
