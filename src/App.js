import { GamePad } from "./GamePad";

export const App = () => {
    return (
        <section className="main_section">
            <div className="frame"></div>
            <GamePad rows={3} columns={3}/>
            <section className="control_pad">
                <button className="control_button" id="x_button">X</button>
                <button className="control_button" id="o_button">0</button>
                <button className="control_button" id="restart_button">RST</button>
            </section>
            <section className="popup">
                <span className="popup_text"></span>
                <button className="popup_button" id="new_game_button">New Game</button>
            </section>
        </section>
    );
}
