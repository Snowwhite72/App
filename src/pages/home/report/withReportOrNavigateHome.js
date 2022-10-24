import React from 'react';
import PropTypes from 'prop-types';
import {withOnyx} from 'react-native-onyx';
import _ from 'underscore';
import getComponentDisplayName from '../../../libs/getComponentDisplayName';
import Navigation from '../../../libs/Navigation/Navigation';
import ONYXKEYS from '../../../ONYXKEYS';
import reportPropTypes from '../../reportPropTypes';

export default function (WrappedComponent) {
    const propTypes = {
        /** The HOC takes an optional ref as a prop and passes it as a ref to the wrapped component.
          * That way, if a ref is passed to a component wrapped in the HOC, the ref is a reference to the wrapped component, not the HOC. */
        forwardedRef: PropTypes.func,

        /** The report currently being looked at */
        report: reportPropTypes,
    };

    const defaultProps = {
        forwardedRef: () => {},
        report: {},
    };

    const WithReportOrNavigateHome = (props) => {
        if (_.isEmpty(props.report)) {
            Navigation.dismissModal();
            return;
        }

        const rest = _.omit(props, ['forwardedRef']);

        return (
            <WrappedComponent
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...rest}
                ref={props.forwardedRef}
            />
        );
    };

    WithReportOrNavigateHome.propTypes = propTypes;
    WithReportOrNavigateHome.defaultProps = defaultProps;
    WithReportOrNavigateHome.displayName = `withReportOrNavigateHome(${getComponentDisplayName(WrappedComponent)})`;
    const withReportOrNavigateHome = React.forwardRef((props, ref) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <WithReportOrNavigateHome {...props} forwardedRef={ref} />
    ));

    return withOnyx({
        report: {
            key: ({route}) => `${ONYXKEYS.COLLECTION.REPORT}${route.params.reportID}`,
        },
    })(withReportOrNavigateHome);
}
