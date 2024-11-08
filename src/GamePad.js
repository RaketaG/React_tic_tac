import {useEffect, useRef, useState} from "react";

const Popup = ({ popupText, restart }) => {
    return (
        <div className="popup">
            <span className="popup_text">{popupText}</span>
            <button
                className="popup_button"
                id="new_game_button"
                onClick={restart}
            >
                New Game
            </button>
        </div>
    )
}

const ControlPad = ({ rstButton, buttonX, buttonO }) => {
    return (
        <section className="control_pad">
            <button
                className="control_button"
                id="x_button"
                onClick={buttonX}
            >
                X
            </button>
            <button
                className="control_button"
                id="o_button"
                onClick={buttonO}
            >
                0
            </button>
            <button
                className="control_button"
                id="restart_button"
                onClick={rstButton}
            >
                RST
            </button>
        </section>
    )
}

export const GamePad = ({rows, columns}) => {

    const matrixOriginalState = Array(rows).fill(null).map((_, row_index) => {
        return Array(columns).fill(null).map((_, column_index) => {
            return {
                row_index,
                column_index,
                value: `button_[${row_index}][${column_index}]`,
                disabled: false
            };
        });
    })
    const inRow = 3;
    const [buttonMatrix, setButtonMatrix] = useState(matrixOriginalState)
    const [popupText, setPopupText] = useState("");
    const [popupVisible, setPopupVisibility] = useState(false);
    const [userSymbol, setUserSymbol] = useState("X");
    const [robotSymbol, setRobotSymbol] = useState("0");

    const checkProgress = (buttonMatrix, inRow, checkFor = null, symbol = "") => {

        for (let i = 0; i < buttonMatrix.length; i++) {
            for (let j = 0; j < buttonMatrix[0].length; j++) {

                for (const sequence of [[0, 1], [1, 0], [1, 1], [1, -1]]) {

                    const tempArray = [buttonMatrix[i][j]]
                    let counter = 1;
                    for (let k = 1; k < inRow; k++) {
                        const iToCompare = i + sequence[0] * k;
                        const jToCompare = j + sequence[1] * k;

                        if (iToCompare >= buttonMatrix.length ||
                            jToCompare >= buttonMatrix.length ||
                            jToCompare < 0) {
                            break;
                        }

                        tempArray.push(buttonMatrix[iToCompare][jToCompare])

                        if (checkFor) {
                            (buttonMatrix[iToCompare][jToCompare].value === buttonMatrix[i][j].value &&
                                buttonMatrix[i][j].value === symbol) && counter++;
                            if (k === inRow - 1 && counter === checkFor) {
                                const index = tempArray.findIndex(item => !item.disabled)
                                if (index) return tempArray[index]
                            }
                        } else {
                            if (buttonMatrix[iToCompare][jToCompare].value === buttonMatrix[i][j].value) {
                                counter++;
                                if (counter === inRow) return true;
                            } else break;
                        }
                    }
                }
            }
        }
        return false;
    }

    const stupidRobot = (buttonMatrix, inRow) => {
        for (const symbol of [robotSymbol, userSymbol]) {
            for (let i = inRow - 1; i > 1; i--) {
                const progress = checkProgress(buttonMatrix, inRow, i, symbol);
                console.log(progress)
                if (progress) {
                    return buttonMatrix.map((rows) => rows.map((button) =>
                        (button.row_index === progress.row_index && button.column_index === progress.column_index) ?
                            {...button, value: robotSymbol, disabled: true} : button
                    ))
                }
            }
        }

        while (true) {
            let randomRow = Math.floor(Math.random() * 3);
            let randomColumn = Math.floor(Math.random() * 3);
            if (!buttonMatrix[randomRow][randomColumn].disabled) {
                return buttonMatrix.map((rows) => rows.map((button) =>
                    (button.row_index === randomRow && button.column_index === randomColumn) ?
                        {...button, value: robotSymbol, disabled: true} : button
                ))
            }
        }
    }

    const handleClick = (row_index, column_index) => {

        let tempMatrix = buttonMatrix;

        tempMatrix = tempMatrix.map((rows) =>
            rows.map((button) =>
                (button.row_index === row_index && button.column_index === column_index) ?
                    {...button, value: userSymbol, disabled: true} : button
        ))

        setButtonMatrix(tempMatrix);

        if (checkProgress(tempMatrix, inRow)) {
            setPopupVisibility(true);
            setPopupText("User Wins !");
        } else if (tempMatrix.every((rows) => rows.every((item) => item.disabled))) {
            setPopupVisibility(true);
            setPopupText("Draw !");
        } else {
            tempMatrix = stupidRobot(tempMatrix, inRow);
            if (checkProgress(tempMatrix, inRow)) {
                setPopupVisibility(true);
                setPopupText("Robot Wins !");
            }
        }
        setButtonMatrix(tempMatrix)
    }

    const restart = () => {
        setButtonMatrix(matrixOriginalState);
        setPopupVisibility(false);
    }

    const handleX = () => {
        setUserSymbol("X");
        setRobotSymbol("0");
    }

    const handleO = () => {
        setUserSymbol("0");
        setRobotSymbol("X");
    }

    return (
        <section className="game_pad">
            {buttonMatrix.map((items) => items.map((item) => {
                return (
                    <button
                        key={`button_[${item.row_index}][${item.column_index}]`}
                        className="game_button"
                        value={item.value}
                        disabled={item.disabled}
                        onClick={() => handleClick(item.row_index, item.column_index)}
                    >
                        {item.value.length > 1 ? "" : item.value}
                    </button>
                );
            }))}
            <ControlPad
                buttonX={() => handleX()}
                buttonO={() => handleO()}
                rstButton={() => restart()} />
            {popupVisible && <Popup popupText={popupText} restart={() => restart()}/>}
        </section>

    );
}