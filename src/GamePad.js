import {useEffect, useState} from "react";

export const GamePad = ({ rows, columns }) => {

    const [buttonMatrix, set_buttonMatrix] = useState(Array(rows).fill(null).map((_, row_index) => {
        return Array(columns).fill(null).map((_, column_index) => {
            return {
                row_index,
                column_index,
                value: `button_[${row_index}][${column_index}]`,
                disabled: false
            };
        });
    }))
    const inRow = 3;

    const checkProgress = (buttonMatrix, inRow, checkFor = null) => {

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
                            (buttonMatrix[iToCompare][jToCompare].value === buttonMatrix[i][j].value) && counter++;
                            if (k === inRow - 1 && counter === checkFor) {
                                const index = tempArray.findIndex(item => !item.disabled)
                                return tempArray[index]
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
        let robotSymbol = "0";
        let userSymbol = "X";

        for (const symbol of [robotSymbol, userSymbol]) {
            for (let i = inRow - 1; i > 1; i--) {
                const progress = checkProgress(buttonMatrix, inRow, i);
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

    const handle_click = (row_index, column_index) => {

        let tempMatrix = buttonMatrix;

        tempMatrix = tempMatrix.map((rows) =>
            rows.map((button) =>
                (button.row_index === row_index && button.column_index === column_index) ?
                    {...button, value: "X", disabled: true} : button
        ))

        set_buttonMatrix(tempMatrix);

        if (checkProgress(tempMatrix, inRow)) {
            setTimeout(() => {
                alert("Winner");
            }, 5)
        } else if (tempMatrix.every((rows) => rows.every((item) => item.disabled))) {
            setTimeout(() => {
                alert("Draw");
            })
        } else {
            tempMatrix = stupidRobot(tempMatrix, inRow);
            if (checkProgress(tempMatrix, inRow)) {
                setTimeout(() => {
                    alert("Robot Wins !");
                }, 5)
            }
        }
        set_buttonMatrix(tempMatrix)
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
                        onClick={() => handle_click(item.row_index, item.column_index)}
                    >
                        {item.value.length > 1 ? "" : item.value}
                    </button>
                );
            }))}
        </section>
    );
}