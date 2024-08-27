import React, { useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  Alert,
  Linking,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import Pdf from 'react-native-pdf';
import { Ionicons } from '@expo/vector-icons';
import { url } from '../../Component/Config';

const documents = [
  {
    id: '1',
    title: 'Icelandic Dictionary',
    uri: 'https://www.princexml.com/samples/invoice/invoicesample.pdf',
  },
  {
    id: '2',
    title: 'Icelandic Dictionary',
    uri: 'https://www.princexml.com/howcome/2016/samples/invoice/index.pdf',
  },
  {
    id: '3',
    title: 'Icelandic Dictionary',
    uri: 'https://www.princexml.com/samples/invoice/invoicesample.pdf',
  },
  {
    id: '4',
    title: 'Icelandic Dictionary',
    uri: 'https://www.princexml.com/samples/invoice/invoicesample.pdf',
  },
];

const classes = [
  { label: 'Class 1', value: 'class1' },
  { label: 'Class 2', value: 'class2' },
  { label: 'Class 3', value: 'class3' },
];

const sections = [
  { label: 'Section A', value: 'sectionA' },
  { label: 'Section B', value: 'sectionB' },
  { label: 'Section C', value: 'sectionC' },
];

const examTypes = [
  { label: 'Final', value: 'final' },
  { label: 'Half Yearly', value: 'half_yearly' },
  { label: 'Quarterly', value: 'quarterly' },
];

const ResultPage = ({ navigation }) => {
  const [selectedClass, setSelectedClass] = useState(classes[0].value);
  const [selectedSection, setSelectedSection] = useState(sections[0].value);
  const [selectedExamType, setSelectedExamType] = useState(examTypes[0].value);
  const [studentId, setStudentId] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [showExamTypeDropdown, setShowExamTypeDropdown] = useState(false);

  const renderDropdown = (data, selectedValue, onSelect, showDropdown, setShowDropdown) => (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setShowDropdown(!showDropdown)}>
        <Text style={styles.dropdownHeaderText}>
          {data.find((item) => item.value === selectedValue)?.label}
        </Text>
      </TouchableOpacity>
      {showDropdown && (
        <FlatList
          data={data}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(item.value);
                setShowDropdown(false);
              }}>
              <Text style={styles.dropdownItemText}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );

  const renderDocumentList = () => (
    <FlatList
      data={documents}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.documentButton}
          onPress={() => setSelectedDocument(item)}>
          <Text style={styles.documentText}>{item.title}</Text>
        </TouchableOpacity>
      )}
    />
  );

  const renderPdfViewer = () => (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => setSelectedDocument(null)}>
          <Ionicons name="arrow-back-circle-outline" size={35} color="black" />
        </TouchableOpacity>
      </View>
      <Pdf
        trustAllCerts={false}
        source={{
          uri: selectedDocument.uri,
        }}
        page={1}
        scale={1.0}
        minScale={0.5}
        maxScale={3.0}
        renderActivityIndicator={() => (
          <ActivityIndicator color="black" size="large" />
        )}
        enablePaging={true}
        onLoadProgress={(percentage) => console.log(`Loading :${percentage}`)}
        onLoadComplete={() => console.log('Loading Complete')}
        onPageChanged={(page, totalPages) => console.log(`${page}/${totalPages}`)}
        onError={(error) => console.log(error)}
        // onPageSingleTap={(page) => alert(page)}
        onPressLink={(link) => Linking.openURL(link)}
        onScaleChanged={(scale) => console.log(scale)}
        spacing={10}
        style={{ width: Dimensions.get('window').width, height: '80%' }}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={styles.box1}>
        <Text style={styles.title}>Result</Text>
      </View>
      {!selectedDocument ? (
        <View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Class:</Text>
            {renderDropdown(classes, selectedClass, setSelectedClass, showClassDropdown, setShowClassDropdown)}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Section:</Text>
            {renderDropdown(sections, selectedSection, setSelectedSection, showSectionDropdown, setShowSectionDropdown)}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Exam Type:</Text>
            {renderDropdown(examTypes, selectedExamType, setSelectedExamType, showExamTypeDropdown, setShowExamTypeDropdown)}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Student ID:</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setStudentId(text)}
              value={studentId}
            />
          </View>
          {renderDocumentList()}
        </View>
      ) : (
        renderPdfViewer()
      )}
    </View>
  );
};

export default ResultPage;

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: '2%',
  },
  box1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  documentButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  documentText: {
    fontSize: 18,
  },
  dropdownContainer: {
    marginVertical: 8,
  },
  dropdownHeader: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  dropdownHeaderText: {
    fontSize: 16,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  backButtonContainer: {
    flex: 0.2,
    position: 'relative',
    marginRight: '85%',
    padding: '2%',
    alignSelf: 'center',
  },
  backButtonIcon: {
    width: 30,
    height: 30,
  },
});
