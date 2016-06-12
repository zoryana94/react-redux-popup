import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as popupActions from 'rrp/actions';
import HigherOrderPopupComponent from 'rrp/higher-order-popup-component';
import { TYPE_POPUP } from 'rrp/popup-collection';
import { popupSelector } from 'rrp/popup-sandbox';

const PROP_TYPES = {
    id: PropTypes.string.isRequired,
    popupClassName: PropTypes.string,
    style: PropTypes.object
};

export default function(ComposedComponent) {
    class Popup extends Component {
        constructor(props) {
            super(props);
            this.closePopup = () => {
                props.closePopup(props.id);
            };
        }

        componentDidMount() {
            window.addEventListener('mouseup', this.closePopup);
        }

        componentWillUnmount() {
            window.removeEventListener('mouseup', this.closePopup);
        }

        render() {
            const className = `js-popup-${this.props.id} ${this.props.popupClassName ? this.props.popupClassName : ''}`;
            let style = null;
            const rectId = `${this.props.id}_rect`;
            if (this.props[rectId]) {
                style = {
                    ...this.props[rectId]
                };
                const { offsetX, offsetY } = this.props;
                style.left -= (offsetX ? offsetX : 0);
                style.top -= (offsetY ? offsetY : 0);
            }

            return (
                <div className={className} onMouseUp={this.stopEvent} style={style}>
                    <ComposedComponent {...this.props} />
                </div>
            );
        }

        stopEvent(event) {
            event.stopPropagation();
        }
    }

    Popup.propTypes = PROP_TYPES;

    return HigherOrderPopupComponent(connect(popupSelector, popupActions)(Popup), TYPE_POPUP);
}
