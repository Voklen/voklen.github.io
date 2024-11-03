class Navbar extends HTMLElement {
	constructor() {
		super();

		this.shadow = this.attachShadow({ mode: "closed" });
		this.render();
	}

	render() {
		this.shadow.innerHTML = `
			<div id="sidebar">
				<nav>
					<a href="/">
						<img src="/assets/icons/coffee.svg" />
						Home
					</a>
					<a href="/wip/">
						<img src="/assets/icons/database.svg" />
						Projects
					</a>
					<a href="/wip/">
						<img src="/assets/icons/code.svg" />
						Tech
					</a>
					<a href="/wip/">
						<img src="/assets/icons/book-open.svg" />
						Blog
					</a>
					<a href="/wip/">
						<img src="/assets/icons/pen-tool.svg" />
						Contact
					</a>
				</nav>
			</div>
		`;

		// Create some CSS to apply to the shadow dom
		const style = document.createElement("style");

		style.textContent = `
			#sidebar {
				height: 100%;
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
			}
			
			nav {
				display: flex;
				flex-direction: column;
				flex-grow: 1;
			}
			
			nav a {
				flex-grow: 1;
				display: flex;
				align-items: center;
				font-size: 2em;
				text-decoration: none;
				color: var(--text-high);
			}
			
			nav a img {
				margin-right: 20px;
			}
    `;

		this.shadow.appendChild(style);
	}
}

customElements.define("nav-bar", Navbar);
