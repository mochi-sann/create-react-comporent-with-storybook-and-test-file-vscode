import TemplateOptions, { FunctionType, TestLibrary } from './templateOptions';

const javascriptComponentTemplate = ({ name, functionType }: TemplateOptions) => `import React from 'react';

${functionType === FunctionType.Function ? `function ${name}({}) {` : ''}${
  functionType === FunctionType.Expression ? `const ${name} = ({}) => {` : ''
}
    return <>${name}</>
};

export default ${name};
`;

const javascriptTestTemplate = (templateOptions: TemplateOptions) => {
  const { testLibrary } = templateOptions;
  return testLibrary === TestLibrary.Enzyme
    ? enzymeTemplate(templateOptions)
    : reactTestingLibraryTemplate(templateOptions);
};

const reactTestingLibraryTemplate = ({ name, cleanup }: TemplateOptions) => `import { ${
  cleanup ? 'cleanup, ' : ''
}render } from '@testing-library/react';
import React from 'react';
import ${name} from './${name}';

describe('${name}', () => {
    ${cleanup ? 'afterEach(cleanup);\n\t' : ''}const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<${name} {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('${name}')).toBeTruthy();
    });
});
`;

const enzymeTemplate = ({ name }: TemplateOptions) => `import { shallow } from 'enzyme';
import React from 'react';
import ${name} from './${name}';

describe('${name}', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const wrapper = shallow(<${name} {...props} />);

        expect(wrapper).toMatchSnapshot();
    });
});
`;

const StoryBookJSTemplate = ({ name, functionType }: TemplateOptions) => `
import React from "react"

import ${name} from "./${name}"

export default {
  title: "coponent/${name}",
  component: ${name},
  argTypes: {
    
  }
}

const Template = (args) => <${name} {...args} />

export const Default = Template.bind({})
Default.args = {
}

`;

export { javascriptComponentTemplate, javascriptTestTemplate, StoryBookJSTemplate };
