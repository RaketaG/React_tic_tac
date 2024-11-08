import { GamePad } from "./GamePad";

export const App = () => {
    return (
        <section className="main_section">
            <div className="frame"></div>
            <GamePad rows={3} columns={3}/>
        </section>
    );
}
