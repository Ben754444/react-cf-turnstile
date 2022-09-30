import * as React from 'react';

interface Props extends RenderParameters {
    "load-callback"?: () => void;
    ref?: any;
    id?: string;
}

interface State {
    ready: boolean;
    id?: string;
    turnstile?: Turnstile;
    rendered: boolean;
}

interface RenderParameters {
    sitekey: string;
    action?: string;
    cData?: any;
    callback: (token: string) => void; //called on load
    "expired-callback"?: () => void;
    "error-callback"?: () => void;
    theme?: "light" | "dark" | "auto";
    tabindex?: number;
}

export interface Turnstile {
    render: (element: Turnstile, params: RenderParameters) => string;
    reset: (widgetId: string) => void;
    getResponse: (widgetId: string) => string;
}

let resolveTurnstileLoad: () => void;

async function createScript(src: string) {
    return new Promise<void>((resolve, reject) => {
        resolveTurnstileLoad = resolve;
        const script = document.createElement("script");
        script.src = src;
        script.id = "cf-turnstile-script";
        script.async = true;
        script.defer = true;
        //script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script ${src}`));
        document.body.appendChild(script);
    });
}

declare global {
    interface Window {
        turnstile: Turnstile;
        onloadTurnstileCallback: () => void;
    }
}
window.onloadTurnstileCallback = function() {
    resolveTurnstileLoad();
};


class CFTurnstile extends React.Component<Props, State> {
    private readonly ref: React.RefObject<Turnstile>;
    constructor(props: Props) {
        console.log("HELLO");
        super(props);
        this.renderTurnstile = this.renderTurnstile.bind(this);
        this.resetTurnstile = this.resetTurnstile.bind(this);
        //this.getTurnstileResponse = this.getTurnstileResponse.bind(this);

        const ready = typeof window.turnstile !== "undefined";
        this.state = {
            ready,
            id: undefined,
            rendered: false
        };

        this.ref = React.createRef();
    }


    componentDidMount() {
        let res;
        if(!document.getElementById("cf-turnstile-script")) {
            res = createScript(`https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback`)
        }
        if(res) {
            res.then(() => {
                console.log("FIRST LOAD");
                //@ts-ignore
                this.setState({turnstile: turnstile, ready: true}, () => {
                    this.renderTurnstile();
                })
            })
        }
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        console.log(prevProps);
        console.log(prevState);
        console.log(this.props);
        if(prevProps !== this.props){
            document.getElementById(this.state.id!)?.remove();
            this.renderTurnstile();
        }
    }



    renderTurnstile() {
        if(this.props["load-callback"]) {
            this.props["load-callback"]();
        }
        if(!this.state.ready || !this.state.turnstile) {
            return
        }

        const res = this.state.turnstile.render(this.ref.current!, this.props);
        if(!res) {
            throw new Error("Failed to render Turnstile");
        }
        this.setState({id: res, rendered: true})
    }

    resetTurnstile() {
        if(!this.state.turnstile) {
            return;
        }
        this.state.turnstile.reset(this.state.id!)
    }

    /*
        // getResponse() doesnt work for some reason?
    getTurnstileResponse() {
        if(!this.state.turnstile) {
            return
        }
        console.log(this.state.id)
        console.log(this.state.turnstile)
        let res;
        try {
            res = this.state.turnstile.getResponse(this.state.id!)
        } catch (e) {
            throw e
        }
        return res;

    }

     */

    render() {
        return (
            // @ts-ignore
            <div ref={this.ref} id={this.props.id}>
            </div>
        );
    }
}

export default CFTurnstile;