export default {
  ':root': [
    {
      title: '添加Scope Slot',
      type: 'button',
      value: {
        set({ data, inputs, outputs, slots, setDesc }, connector) {
          slots.add({ id: 'test', title: 'test', type: 'scope' });
        }
      }
    },
    {
      title: '添加Slot I/O',
      type: 'button',
      value: {
        set({ data, inputs, outputs, slots, setDesc }, connector) {
          slots.get('content').inputs.add('test', 'test', { type: 'any' });
        }
      }
    }
  ]
};
