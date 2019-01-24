import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import style from './style';
import { Button } from 'preact-material-components/Button';
import TextField from 'preact-material-components/TextField';
import 'preact-material-components/TextField/style.css';

export default class Home extends Component {
	state= {
		faltas: []
	}

	componentWillMount() {
		if (typeof window !== 'undefined') {
			const faltas = JSON.parse(localStorage.getItem('faltas'));
			if (faltas) {
				this.setState({ faltas });
			}
			else {
				const date = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
				const initialCards = [
					{
						title: 'Segunda-feira',
						total: 0,
						editing: false,
						datas: []
					},
					{
						title: 'Terça-feira',
						total: 0,
						editing: false,
						datas: []
					},
					{
						title: 'Quarta-feira',
						total: 0,
						editing: false,
						datas: []
					},
					{
						title: 'Quinta-feira',
						total: 0,
						editing: false,
						datas: []
					},
					{
						title: 'Sexta-feira',
						total: 0,
						editing: false,
						datas: []
					}
				];
				this.setState({ faltas: initialCards });
				localStorage.setItem('faltas', JSON.stringify(this.state.faltas));
			}
		}
	}

	handleSave=() => {
		this.setState({ editing: false });
	}

	handleEdit=() => {
		this.setState({ editing: true });
	}

	handleCreateCard=() => {
		const updatedFaltas = [...this.state.faltas];
		const date = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
		const newCard = {
			title: 'Minha matéria',
			total: 0,
			editing: true,
			datas: [
				{
					date,
					quantity: 0
				}
			]
		};
		updatedFaltas.push(newCard);
		this.setState({ faltas: updatedFaltas });
	}

	mapDays = () => this.state.faltas.map((f, i) => (
		<Card class="space-y-md">
			<div class={style.cardHeader}>
				{
					this.state.faltas[i].editing ? (
						<TextField
							label="Titulo"
							value={this.state.faltas[i].title}
							onChange={(e) => {
								const newTitle = e.target.value;
								if (newTitle) {
									let updatedFaltas = [...this.state.faltas];
									updatedFaltas[i].title = newTitle;
									this.setState({ faltas: updatedFaltas });
								}
							}}
						/>
					):(
						<h2 class="mdc-typography--title">{f.title}</h2>
					)
				}
				<h3 class="mdc-typography--subtitle1">{f.total} faltas</h3>
			</div>
			{
				f.datas.map((d,datasIndex) => this.state.faltas[i].editing?(
					<div style="display: flex; align-items: center;">
						<TextField
							label="dia"
							value={this.state.faltas[i].datas[datasIndex].date}
							onChange={(e) => {
								const newDate = e.target.value;
								if (newDate) {
									let updatedFaltas = [...this.state.faltas];
									updatedFaltas[i].datas[datasIndex].date = newDate;
									this.setState({ faltas: updatedFaltas });
								}
							}}
						/>
						<TextField
							label="faltas"
							value={this.state.faltas[i].datas[datasIndex].quantity}
							onChange={(e) => {
								const newQuantity = e.target.value;
								if (newQuantity) {
									let updatedFaltas = [...this.state.faltas];
									let oldQuantity = this.state.faltas[i].datas[datasIndex].quantity;
									let newTotal = Number(updatedFaltas[i].total) - Number(oldQuantity) + Number(newQuantity);
									updatedFaltas[i].total = newTotal;
									updatedFaltas[i].datas[datasIndex].quantity = newQuantity;
									this.setState({ faltas: updatedFaltas });
								}
							}}
						/>
						<Button onClick={() => {
							let updatedFaltas = [...this.state.faltas];
							updatedFaltas[i].total -= updatedFaltas[i].datas[datasIndex].quantity;
							updatedFaltas[i].datas = updatedFaltas[i].datas.filter((d, removeDataIndex) => removeDataIndex !== datasIndex);
							this.setState({ faltas: updatedFaltas });
						}}
						>X</Button>
					</div>
				):(
					<div class={`${style.cardBody} mdc-typography--body1`}>
						<p class="mdc-typography--caption">{d.date} - {d.quantity} faltas</p>
					</div>
				)
				)
			}
			<Card.Actions style="text-transform: uppercase;">
				<Card.ActionButton onClick={() => {
					let updatedFaltas = [...this.state.faltas];
					const date = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
					const newFalta = {
						date,
						quantity: 1
					};
					updatedFaltas[i].total += 1;
					updatedFaltas[i].datas.push(newFalta);
					updatedFaltas[i].editing = true;
					this.setState({ faltas: updatedFaltas });
				}}
				>Adicionar falta</Card.ActionButton>
				{
					this.state.faltas[i].editing? (
						<Card.ActionButton onClick={() => {
							let updatedFaltas = [...this.state.faltas];
							updatedFaltas[i].editing = false;
							this.setState({ faltas: updatedFaltas });
							if (typeof window !== 'undefined') {
								localStorage.setItem('faltas', JSON.stringify(this.state.faltas));
							}
						}}
						>Salvar</Card.ActionButton>
					):(
						<Card.ActionButton onClick={() => {
							let updatedFaltas = [...this.state.faltas];
							updatedFaltas[i].editing = true;
							this.setState({ faltas: updatedFaltas });
						}}
						>Editar</Card.ActionButton>
					)
				}
				<Card.ActionButton onClick={() => {
					let updatedFaltas = this.state.faltas.filter((f, filterIndex) => filterIndex !== i);
					this.setState({ faltas: updatedFaltas });
					if (typeof window !== 'undefined') {
						localStorage.setItem('faltas', JSON.stringify(this.state.faltas));
					}
				}}
				>Deletar</Card.ActionButton>
			</Card.Actions>
		</Card>
	));

	render() {
		return (
			<div class={`${style.home} page`}>
				<h1>Minhas faltas</h1>
				{ this.mapDays() }
				<Button onClick={this.handleCreateCard}>Criar Card</Button>
			</div>
		);
	}
}
